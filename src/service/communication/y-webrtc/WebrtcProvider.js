import { Observable } from 'lib0/observable.js';
import { SignalingConn } from './SignalingConn';
import { signalingConns } from './y-webrtc';
import { openRoom, rooms } from './Room';

import * as awarenessProtocol from 'y-protocols/awareness.js';
import * as cryptoutils from './crypto.js';
import * as promise from 'lib0/promise.js';
import * as map from 'lib0/map.js';

/**
 * @extends Observable<string>
 */
export class WebrtcProvider extends Observable {
	/**
   * @param {string} roomName
   * @param {Y.Doc} doc
   * @param {Object} [opts]
   * @param {string?} [opts.peerID]
   * @param {Array<string>} [opts.signaling]
   * @param {string?} [opts.password]
   * @param {awarenessProtocol.Awareness} [opts.awareness]
   */
	constructor(
		roomName,
		doc,
		{
			peerID = '',
			signaling = [
				'wss://signaling.yjs.dev',
				'wss://y-webrtc-uchplqjsol.now.sh',
				'wss://y-webrtc-signaling-eu.herokuapp.com',
				'wss://y-webrtc-signaling-us.herokuapp.com'
			],
			password = null,
			awareness = new awarenessProtocol.Awareness(doc)
		} = {}
	) {
		super();
		this.roomName = roomName;
		this.doc = doc;
		/**
     * @type {awarenessProtocol.Awareness}
     */
		this.awareness = awareness;
		this.shouldConnect = false;
		this.signalingUrls = signaling;
		this.signalingConns = [];
		/**
     * @type {PromiseLike<CryptoKey | null>}
     */
		this.key = password
			? cryptoutils.deriveKey(password, roomName) /** @type {PromiseLike<null>} */
			: promise.resolve(null);
		/**
     * @type {Room|null}
     */
		this.room = null;
		this.key.then((key) => {
			this.room = openRoom(doc, this, roomName, key, peerID);
			if (this.shouldConnect) {
				this.room.connect();
			} else {
				this.room.disconnect();
			}
		});
		this.connect();
	}
	/**
   * @type {boolean}
   */
	get connected() {
		return this.room !== null && this.shouldConnect;
	}
	connect() {
		this.shouldConnect = true;
		this.signalingUrls.forEach((url) => {
			const signalingConn = map.setIfUndefined(signalingConns, url, () => new SignalingConn(url));
			this.signalingConns.push(signalingConn);
			signalingConn.providers.add(this);
		});
		if (this.room) {
			this.room.connect();
		}
	}
	disconnect() {
		this.shouldConnect = false;
		this.signalingConns.forEach((conn) => {
			conn.providers.delete(this);
			if (conn.providers.size === 0) {
				conn.destroy();
				signalingConns.delete(this.roomName);
			}
		});
		if (this.room) {
			this.room.disconnect();
		}
	}
	/**
     * @async function
     */
	destroy() {
		// need to wait for key before deleting room
		this.key.then(() => {
			/** @type {Room} */ this.room.destroy();
			rooms.delete(this.roomName);
		});
		super.destroy();
	}
}
