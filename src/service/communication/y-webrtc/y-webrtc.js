import * as encoding from 'lib0/encoding.js';
import * as decoding from 'lib0/decoding.js';
import * as bc from 'lib0/broadcastchannel.js';
import * as buffer from 'lib0/buffer.js';
import * as syncProtocol from 'y-protocols/sync.js';
import * as awarenessProtocol from 'y-protocols/awareness.js';
import * as cryptoutils from './crypto.js';

// import * as logging from 'lib0/logging.js';
// const log = logging.createModuleLogger('y-webrtc');

export const messageSync = 0;
export const messageQueryAwareness = 3;
export const messageAwareness = 1;
export const messageBcPeerId = 4;

/**
 * @type {Map<string, SignalingConn>}
 */
export const signalingConns = new Map();

/**
 * @param {Room} room
 * @param {Uint8Array} buf
 * @param {function} syncedCallback
 * @return {encoding.Encoder?}
 */
export const readMessage = (room, buf, syncedCallback) => {
	const decoder = decoding.createDecoder(buf);
	const encoder = encoding.createEncoder();
	const messageType = decoding.readVarUint(decoder);
	if (room === undefined) {
		return null;
	}
	const awareness = room.awareness;
	const doc = room.doc;
	let sendReply = false;
	switch (messageType) {
		case messageSync:
			encoding.writeVarUint(encoder, messageSync);
			const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, doc, room);
			if (syncMessageType === syncProtocol.messageYjsSyncStep2 && !room.synced) {
				syncedCallback();
			}
			if (syncMessageType === syncProtocol.messageYjsSyncStep1) {
				sendReply = true;
			}
			break;
		case messageQueryAwareness:
			encoding.writeVarUint(encoder, messageAwareness);
			encoding.writeVarUint8Array(
				encoder,
				awarenessProtocol.encodeAwarenessUpdate(awareness, Array.from(awareness.getStates().keys()))
			);
			sendReply = true;
			break;
		case messageAwareness:
			awarenessProtocol.applyAwarenessUpdate(awareness, decoding.readVarUint8Array(decoder), room);
			break;
		case messageBcPeerId: {
			const add = decoding.readUint8(decoder) === 1;
			const peerName = decoding.readVarString(decoder);
			if (
				peerName !== room.peerId &&
				((room.bcConns.has(peerName) && !add) || (!room.bcConns.has(peerName) && add))
			) {
				const removed = [];
				const added = [];
				if (add) {
					room.bcConns.add(peerName);
					added.push(peerName);
				} else {
					room.bcConns.delete(peerName);
					removed.push(peerName);
				}
				room.provider.emit('peers', [
					{
						added,
						removed,
						webrtcPeers : Array.from(room.webrtcConns.keys()),
						bcPeers     : Array.from(room.bcConns)
					}
				]);
				broadcastBcPeerId(room);
			}
			break;
		}
		default:
			console.error('Unable to compute message');
			return encoder;
	}
	if (!sendReply) {
		// nothing has been written, no answer created
		return null;
	}
	return encoder;
};

/**
 * @param {Room} room
 * @param {Uint8Array} m
 */
export const broadcastBcMessage = (room, m) =>
	cryptoutils.encrypt(m, room.key).then((data) => room.mux(() => bc.publish(room.name, data)));

/**
 * @param {Room} room
 */
export const announceSignalingInfo = (room) => {
	signalingConns.forEach((conn) => {
		// only subcribe if connection is established, otherwise the conn automatically subscribes to all rooms
		if (conn.connected) {
			conn.send({ type: 'subscribe', topics: [ room.name ] });
			publishSignalingMessage(conn, room, { type: 'announce', from: room.peerId });
		}
	});
};

export const broadcastBcPeerId = (room) => {
	// broadcast peerId via broadcastchannel
	const encoderPeerIdBc = encoding.createEncoder();
	encoding.writeVarUint(encoderPeerIdBc, messageBcPeerId);
	encoding.writeUint8(encoderPeerIdBc, 1);
	encoding.writeVarString(encoderPeerIdBc, room.peerId);
	broadcastBcMessage(room, encoding.toUint8Array(encoderPeerIdBc));
};

/**
 * @param {SignalingConn} conn
 * @param {Room} room
 * @param {any} data
 */
export const publishSignalingMessage = (conn, room, data) => {
	if (room.key) {
		cryptoutils.encryptJson(data, room.key).then((data) => {
			conn.send({ type: 'publish', topic: room.name, data: buffer.toBase64(data) });
		});
	} else {
		conn.send({ type: 'publish', topic: room.name, data });
	}
};
