import * as Y from 'yjs';
import { Message, DrawingPath } from '../models';
import { PersistentStore } from './persistance';

export type Transact = (f: (arg0: any) => void) => void;

export interface CacheStoreInterface {
	/**
	 * @type {YDoc<any>}
	 */
	yDoc;
	/**
	 * @type {YArray<DrawingPath>}
	 */
	drawPaths;
	// /**
	// * @type {YMap<GameState>}
	// **/
	// gameState;
	// hasGameState: boolean;
	// /**
	//  * @type {YMap<any>}
	//  */
	// clock;
	/**
	 * @type {YArray<Message>}
	 */
	messages;
	/**
	 * @type {YMap<Player>}
	 */
	players;
	/**
   * Changes that happen inside of a transaction are bundled. This means that
   * the observer fires _after_ the transaction is finished and that all changes
   * that happened inside of the transaction are sent as one message to the
   * other peers.
   *
   *  @param {function(Transaction):void} f The function that should be executed as a transaction
   * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
   */
	transact: Transact;

	/**
	 * Cleans up, all resources, needs to be called, 
	 */
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

	public get transact() {
		return this._yDoc.transact;
	}

	constructor() {
		this._yDoc.clientID = PersistentStore.clientID;
	}

	public get yDoc() {
		return this._yDoc;
	}

	// private _drawPaths = this.yDoc.getArray<DrawingPath>('drawState');
	public get drawPaths() {
		return this.yDoc.getArray<DrawingPath>('drawState');
	}

	// private _messages = ;
	public get messages() {
		return this.yDoc.getArray<Message>('messages');
	}

	// // private _gameState = ;
	// public get gameState() {
	// 	console.debug('REmove me !!');
	// 	return this.yDoc.getMap('gameState');
	// }

	// public get hasGameState() {
	// 	console.log(this.yDoc.share, this._yDoc.store);
	// 	return this.yDoc.share.has('gameState');
	// }

	// private _clock = ;

	// public get clock() {
	// 	console.trace('Do not use Clock');
	// 	return this.yDoc.getMap('clock');
	// }

	public get players() {
		return this.yDoc.getMap('players');
	}

	dispose() {
		this._yDoc.destroy();
		console.debug('CacheStorage dispose');
	}
}
