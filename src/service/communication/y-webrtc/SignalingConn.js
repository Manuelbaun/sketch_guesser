import * as ws from 'lib0/websocket.js';
import * as map from 'lib0/map.js';
import * as buffer from 'lib0/buffer.js';
import { rooms } from './Room';
import * as cryptoutils from './crypto.js';
import { WebrtcConn } from './WebrtcConn';
import { log, publishSignalingMessage } from './y-webrtc';

export class SignalingConn extends ws.WebsocketClient {
	constructor(url) {
		super(url);
		/**
     * @type {Set<WebrtcProvider>}
     */
		this.providers = new Set();
		this.on('connect', () => {
			log(`connected (${url})`);
			const topics = Array.from(rooms.keys());
			this.send({ type: 'subscribe', topics });
			rooms.forEach((room) => publishSignalingMessage(this, room, { type: 'announce', from: room.peerId }));
		});
		this.on('message', (m) => {
			if (m.type === 'publish') {
				const roomName = m.topic;
				const room = rooms.get(roomName);
				if (room == null || typeof roomName !== 'string') {
					return;
				}
				const execMessage = (data) => {
					const webrtcConns = room.webrtcConns;
					const peerId = room.peerId;
					if (
						data == null ||
						data.from === peerId ||
						(data.to !== undefined && data.to !== peerId) ||
						room.bcConns.has(data.from)
					) {
						// ignore messages that are not addressed to this conn, or from clients that are connected via broadcastchannel
						return;
					}
					const emitPeerChange = webrtcConns.has(data.from)
						? () => {}
						: () =>
								room.provider.emit('peers', [
									{
										removed     : [],
										added       : [ data.from ],
										webrtcPeers : Array.from(room.webrtcConns.keys()),
										bcPeers     : Array.from(room.bcConns)
									}
								]);
					if (data.type === 'announce') {
						map.setIfUndefined(webrtcConns, data.from, () => new WebrtcConn(this, true, data.from, room));
						emitPeerChange();
					} else if (data.type === 'signal') {
						if (data.to === peerId) {
							map
								.setIfUndefined(
									webrtcConns,
									data.from,
									() => new WebrtcConn(this, false, data.from, room)
								)
								.peer.signal(data.signal);
							emitPeerChange();
						}
					}
				};
				if (room.key) {
					if (typeof m.data === 'string') {
						cryptoutils.decryptJson(buffer.fromBase64(m.data), room.key).then(execMessage);
					}
				} else {
					execMessage(m.data);
				}
			}
		});
		this.on('disconnect', () => log(`disconnect (${url})`));
	}
}
