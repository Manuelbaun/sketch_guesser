import Peer from 'simple-peer';
import * as logging from 'lib0/logging.js';
import * as encoding from 'lib0/encoding.js';
import * as syncProtocol from 'y-protocols/sync.js';
import * as awarenessProtocol from 'y-protocols/awareness.js';

import { publishSignalingMessage, messageSync, messageAwareness, announceSignalingInfo, readMessage } from './y-webrtc';

const log = logging.createModuleLogger('y-WebrtcConn');

export class WebrtcConn {
	/**
   * @param {SignalingConn} signalingConn
   * @param {boolean} initiator
   * @param {string} remotePeerId
   * @param {Room} room
   */
	constructor(signalingConn, initiator, remotePeerId, room) {
		log('establishing connection to ', logging.BOLD, remotePeerId);
		this.room = room;
		this.remotePeerId = remotePeerId;
		this.closed = false;
		this.connected = false;
		this.synced = false;
		/**
     * @type {any}
     */
		this.peer = new Peer({ initiator });
		this.peer.on('signal', (signal) => {
			publishSignalingMessage(signalingConn, room, {
				to     : remotePeerId,
				from   : room.peerId,
				type   : 'signal',
				signal
			});
		});

		this.peer.on('connect', () => {
			log('connected to ', logging.BOLD, remotePeerId);
			this.connected = true;
			// send sync step 1
			const provider = room.provider;
			const doc = provider.doc;
			const awareness = room.awareness;
			const encoder = encoding.createEncoder();

			encoding.writeVarUint(encoder, messageSync);
			syncProtocol.writeSyncStep1(encoder, doc);

			sendWebrtcConn(this, encoder);

			const awarenessStates = awareness.getStates();

			if (awarenessStates.size > 0) {
				const encoder = encoding.createEncoder();
				encoding.writeVarUint(encoder, messageAwareness);
				encoding.writeVarUint8Array(
					encoder,
					awarenessProtocol.encodeAwarenessUpdate(awareness, Array.from(awarenessStates.keys()))
				);
				sendWebrtcConn(this, encoder);
			}
		});
		this.peer.on('close', () => {
			this.connected = false;
			this.closed = true;
			if (room.webrtcConns.has(this.remotePeerId)) {
				room.webrtcConns.delete(this.remotePeerId);
				room.provider.emit('peers', [
					{
						removed     : [ this.remotePeerId ],
						added       : [],
						webrtcPeers : Array.from(room.webrtcConns.keys()),
						bcPeers     : Array.from(room.bcConns)
					}
				]);
			}
			checkIsSynced(room);
			this.peer.destroy();
			log('closed connection to ', logging.BOLD, remotePeerId);
		});
		this.peer.on('error', (err) => {
			announceSignalingInfo(room);
			log('error in connection to ', logging.BOLD, remotePeerId, ': ', err);
		});
		this.peer.on('data', (data) => {
			const answer = readPeerMessage(this, data);
			if (answer !== null) {
				sendWebrtcConn(this, answer);
			}
		});
	}
	destroy() {
		this.peer.destroy();
	}
}

/**
 * @param {WebrtcConn} peerConn
 * @param {Uint8Array} buf
 * @return {encoding.Encoder?}
 */
export const readPeerMessage = (peerConn, buf) => {
	const room = peerConn.room;
	log(
		'received message from ',
		logging.BOLD,
		peerConn.remotePeerId,
		logging.GREY,
		' (',
		room.name,
		')',
		logging.UNBOLD,
		logging.UNCOLOR
	);
	return readMessage(room, buf, () => {
		peerConn.synced = true;
		log('synced ', logging.BOLD, room.name, logging.UNBOLD, ' with ', logging.BOLD, peerConn.remotePeerId);
		checkIsSynced(room);
	});
};

/**
 * @param {WebrtcConn} webrtcConn
 * @param {encoding.Encoder} encoder
 */
export const sendWebrtcConn = (webrtcConn, encoder) => {
	log(
		'send message to ',
		logging.BOLD,
		webrtcConn.remotePeerId,
		logging.UNBOLD,
		logging.GREY,
		' (',
		webrtcConn.room.name,
		')',
		logging.UNCOLOR
	);
	try {
		webrtcConn.peer.send(encoding.toUint8Array(encoder));
	} catch (e) {}
};

/**
 * @param {Room} room
 */
export const checkIsSynced = (room) => {
	let synced = true;

	console.log('CHEKC, if SYNCED');
	room.webrtcConns.forEach((peer) => {
		if (!peer.synced) {
			synced = false;
		}
	});
	if ((!synced && room.synced) || (synced && !room.synced)) {
		room.synced = synced;
		room.provider.emit('synced', [ { synced } ]);
		log('synced ', logging.BOLD, room.name, logging.UNBOLD, ' with all peers');
	}
};
