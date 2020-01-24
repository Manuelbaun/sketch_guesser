import { createMutex } from 'lib0/mutex.js';
import * as error from 'lib0/error';
import * as random from 'lib0/random.js';
import * as encoding from 'lib0/encoding.js';
import * as syncProtocol from 'y-protocols/sync.js';
import * as awarenessProtocol from 'y-protocols/awareness.js';
import * as bc from 'lib0/broadcastchannel.js';
import * as cryptoutils from './crypto.js';
import * as logging from 'lib0/logging.js';

import {
	readMessage,
	broadcastBcMessage,
	messageSync,
	messageAwareness,
	announceSignalingInfo,
	broadcastBcPeerId,
	messageQueryAwareness,
	signalingConns,
	messageBcPeerId
} from './y-webrtc';

const log = logging.createModuleLogger('y-Room');

/**
 * @type {Map<string,Room>}
 */
export const rooms = new Map();

/**
 * @param {Y.Doc} doc
 * @param {WebrtcProvider} provider
 * @param {string} name
 * @param {CryptoKey|null} key
 * @return {Room}
 */
export const openRoom = (doc, provider, name, key, peerID) => {
	// there must only be one room
	if (rooms.has(name)) {
		throw error.create(`A Yjs Doc connected to room "${name}" already exists!`);
	}

	const room = new Room(doc, provider, name, key, peerID);
	/** @type {Room} */
	rooms.set(name, room);
	return room;
};

export class Room {
	/**
   * @param {Y.Doc} doc
   * @param {WebrtcProvider} provider
   * @param {string} name
   * @param {CryptoKey|null} key
   */
	constructor(doc, provider, name, key, peerID) {
		/**
     * Do not assume that peerId is unique. This is only meant for sending signaling messages.
     *
     * @type {string}
     */
		this.peerId = peerID || random.uuidv4();
		this.doc = doc;
		/**
     * @type {awarenessProtocol.Awareness}
     */
		this.awareness = provider.awareness;
		this.provider = provider;
		this.synced = false;
		this.name = name;
		// @todo make key secret by scoping
		this.key = key;
		/**
     * @type {Map<string, WebrtcConn>}
     */
		this.webrtcConns = new Map();
		/**
     * @type {Set<string>}
     */
		this.bcConns = new Set();
		this.mux = createMutex();
		this.bcconnected = false;
		/**
     * @param {ArrayBuffer} data
     */
		this._bcSubscriber = (data) =>
			cryptoutils.decrypt(new Uint8Array(data), key).then((m) =>
				this.mux(() => {
					const reply = readMessage(this, m, () => {});
					if (reply) {
						broadcastBcMessage(this, encoding.toUint8Array(reply));
					}
				})
			);
		/**
     * Listens to Yjs updates and sends them to remote peers
     *
     * @param {Uint8Array} update
     * @param {any} origin
     */
		this._docUpdateHandler = (update, origin) => {
			if (origin !== this) {
				const encoder = encoding.createEncoder();
				encoding.writeVarUint(encoder, messageSync);
				syncProtocol.writeUpdate(encoder, update);
				broadcastRoomMessage(this, encoding.toUint8Array(encoder));
			}
		};
		/**
     * Listens to Awareness updates and sends them to remote peers
     *
     * @param {any} changed
     * @param {any} origin
     */
		this._awarenessUpdateHandler = ({ added, updated, removed }, origin) => {
			const changedClients = added.concat(updated).concat(removed);
			const encoder = encoding.createEncoder();
			encoding.writeVarUint(encoder, messageAwareness);
			encoding.writeVarUint8Array(
				encoder,
				awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
			);
			broadcastRoomMessage(this, encoding.toUint8Array(encoder));
		};
		this.doc.on('update', this._docUpdateHandler);
		this.awareness.on('change', this._awarenessUpdateHandler);
		window.addEventListener('beforeunload', () => {
			awarenessProtocol.removeAwarenessStates(this.awareness, [ doc.clientID ], 'window unload');
			rooms.forEach((room) => {
				room.disconnect();
			});
		});
	}

	connect() {
		// signal through all available signaling connections
		announceSignalingInfo(this);
		const roomName = this.name;
		bc.subscribe(roomName, this._bcSubscriber);
		this.bcconnected = true;
		// broadcast peerId via broadcastchannel
		broadcastBcPeerId(this);

		// write sync step 1
		const encoderSync = encoding.createEncoder();
		encoding.writeVarUint(encoderSync, messageSync);
		syncProtocol.writeSyncStep1(encoderSync, this.doc);
		broadcastBcMessage(this, encoding.toUint8Array(encoderSync));
		// broadcast local state
		const encoderState = encoding.createEncoder();
		encoding.writeVarUint(encoderState, messageSync);
		syncProtocol.writeSyncStep2(encoderState, this.doc);
		broadcastBcMessage(this, encoding.toUint8Array(encoderState));
		// write queryAwareness
		const encoderAwarenessQuery = encoding.createEncoder();
		encoding.writeVarUint(encoderAwarenessQuery, messageQueryAwareness);
		broadcastBcMessage(this, encoding.toUint8Array(encoderAwarenessQuery));
		// broadcast local awareness state
		const encoderAwarenessState = encoding.createEncoder();
		encoding.writeVarUint(encoderAwarenessState, messageAwareness);
		encoding.writeVarUint8Array(
			encoderAwarenessState,
			awarenessProtocol.encodeAwarenessUpdate(this.awareness, [ this.doc.clientID ])
		);
		broadcastBcMessage(this, encoding.toUint8Array(encoderAwarenessState));
	}

	disconnect() {
		// signal through all available signaling connections
		signalingConns.forEach((conn) => {
			if (conn.connected) {
				conn.send({ type: 'unsubscribe', topics: [ this.name ] });
			}
		});
		awarenessProtocol.removeAwarenessStates(this.awareness, [ this.doc.clientID ], 'disconnect');
		// broadcast peerId removal via broadcastchannel
		const encoderPeerIdBc = encoding.createEncoder();
		encoding.writeVarUint(encoderPeerIdBc, messageBcPeerId);
		encoding.writeUint8(encoderPeerIdBc, 0); // remove peerId from other bc peers
		encoding.writeVarString(encoderPeerIdBc, this.peerId);
		broadcastBcMessage(this, encoding.toUint8Array(encoderPeerIdBc));
		bc.unsubscribe(this.name, this._bcSubscriber);
		this.bcconnected = false;
		this.doc.off('update', this._docUpdateHandler);
		this.awareness.off('change', this._awarenessUpdateHandler);
		this.webrtcConns.forEach((conn) => conn.destroy());
	}
	destroy() {
		this.disconnect();
	}
}

/**
 * @param {Room} room
 * @param {Uint8Array} m
 */
export const broadcastRoomMessage = (room, m) => {
	if (room.bcconnected) {
		broadcastBcMessage(room, m);
	}
	broadcastWebrtcConn(room, m);
};

/**
 * @param {Room} room
 * @param {Uint8Array} m
 */
const broadcastWebrtcConn = (room, m) => {
	log(
		'broadcast message in: ',
		logging.GREEN,
		logging.BOLD,
		'WEBRTC - ',
		logging.UNCOLOR,
		'Room: ',
		room.name,
		logging.UNBOLD
	);
	room.webrtcConns.forEach((conn) => {
		try {
			conn.peer.send(m);
		} catch (e) {
			log(logging.BOLD, logging.RED, 'Could not send to peer', conn.peer);
		}
	});
};
