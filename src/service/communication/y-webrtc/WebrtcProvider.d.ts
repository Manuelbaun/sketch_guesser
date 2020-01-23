import { Observable } from 'lib0/observable.js';
import { SignalingConn } from './SignalingConn';
import { openRoom, rooms } from './Room';

import * as awarenessProtocol from 'y-protocols/awareness.js';
import * as cryptoutils from './crypto.js/index.js';
import * as promise from 'lib0/promise.js';
import * as map from 'lib0/map.js';

export declare class WebrtcProvider extends Observable<string> {
	/**
   * @param {string} roomName
   * @param {Y.Doc} doc
   * @param {Object} [opts]
   * @param {string} [opts.peerID]
   * @param {Array<string>} [opts.signaling]
   * @param {string?} [opts.password]
   * @param {awarenessProtocol.Awareness} [opts.awareness]
   */
	constructor(roomName: string, doc: Y.Doc, options);

	get connected(): boolean;

	connect(): void;
	disconnect(): void;

	async destroy(): void;
}
