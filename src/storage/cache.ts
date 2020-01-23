import * as Y from 'yjs';
import { Message, DrawingPath } from '../models';
import { PersistentStore } from './persistance';

export interface CacheStoreInterface {
	/**
	 * @type {YDoc<any>}
	 */
	yDoc;
	/**
	 * @type {YArray<DrawingPath>}
	 */
	drawPaths;
	/**
	* @type {YMap<GameState>}
	**/
	gameState;
	/**
	 * @type {YMap<any>}
	 */
	clock;
	/**
	 * @type {YArray<Message>}
	 */
	messages;
	/**
	 * @type {YMap<Player>}
	 */
	players;

	dispose();
}

/**
 * *CacheStore* creates the yDoc and all other sub documents
 * which needs to be synced between all peers.
 * Further, this class will be used in the communication.service class
 * which 
 */

export class CacheStore implements CacheStoreInterface {
	private _yDoc = new Y.Doc();

	constructor() {
		this._yDoc.clientID = PersistentStore.clientID;
	}
	public get yDoc() {
		return this._yDoc;
	}

	private _drawPaths = this.yDoc.getArray<DrawingPath>('drawState');
	public get drawPaths() {
		return this._drawPaths;
	}

	private _messages = this.yDoc.getArray<Message>('messages');
	public get messages() {
		return this._messages;
	}

	private _gameState = this.yDoc.getMap('gameState');
	public get gameState() {
		return this._gameState;
	}

	private _clock = this.yDoc.getMap('clock');
	public get clock() {
		return this._clock;
	}

	private _players = this.yDoc.getMap('players');
	public get players() {
		return this._players;
	}

	dispose() {
		this._yDoc.destroy();
		console.log('CacheStorage dispose');
	}
}
