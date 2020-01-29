import { Doc as YDoc } from 'yjs';
import { DrawingPath } from '../../models';
import { PersistentStore } from '../store/persistance';

export interface CacheStoreInterface {
	/**
	 * @type {YDoc<any>}
	 */
	yDoc;

	id: number;
	/**
	 * @type {YArray<DrawingPath>}
	 */
	drawPaths;

	/**
   * Changes that happen inside of a transaction are bundled. This means that
   * the observer fires _after_ the transaction is finished and that all changes
   * that happened inside of the transaction are sent as one message to the
   * other peers.
   *
   *  @param {function(Transaction):void} f The function that should be executed as a transaction
   * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
   */
	transact;

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
	private _yDoc = new YDoc();

	constructor() {
		this._yDoc.clientID = PersistentStore.clientID;
	}

	get id(): number {
		return this._yDoc.clientID;
	}

	public get transact() {
		return this._yDoc.transact;
	}

	public get yDoc() {
		return this._yDoc;
	}

	public get drawPaths() {
		return this.yDoc.getArray<DrawingPath>('drawState');
	}

	dispose() {
		this._yDoc.destroy();
		console.debug('CacheStorage dispose');
	}
}
