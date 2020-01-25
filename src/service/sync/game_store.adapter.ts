import { Map as YMap } from 'yjs';
import { CacheStoreInterface } from './cache';
import { GAME_STORE_NAME, GameStoreKeys } from '../../models';
import { IStoreAdapter } from './store.adapter';
// import ulog from 'ulog';
// const log = ulog('Game-Store-Adapter');

// Utility helper type
export interface IGameStoreAdapter<Keys> extends IStoreAdapter<Keys> {
	onUpdate: (key: GameStoreKeys, value: any) => void;
}

export class GameStoreAdapter implements IGameStoreAdapter<GameStoreKeys> {
	private _store = new YMap<any>();

	// a transaction in one batch function
	private _transact;

	constructor(store: CacheStoreInterface) {
		// store ref to transact.
		this._transact = store.yDoc.transact;

		/**
		 * checks before calling gameState! calling Gamestate 
		 * will create a new map or yield an existing one. 
		 * therefore check if it exits before 
		 * if not, then setting props must happen, otherwise not 
		 * TODO: Check if game exits => needs to happen after sync
		 */
		const gameStateDidExist = store.yDoc.share.has(GAME_STORE_NAME);

		// creates the Map of GameState, if exits, it will yield the exiting one
		this._store = store.yDoc.getMap(GAME_STORE_NAME);
		// Observe the changes on that map
		this._store.observe(this._observeHandler);

		// TODO:
		// The creator of the first game state will be the
		// master for the first round
		if (!gameStateDidExist) {
			console.log('Game did not exist');
		}
	}

	// Override me
	onUpdate = (key: GameStoreKeys, value: any) => {
		throw Error('please Overwrite me');
	};

	dispose() {
		this._store.unobserve(this._observeHandler);
	}

	private _observeHandler = (event, transation) => {
		Array.from<GameStoreKeys>(event.keysChanged).forEach((key) => {
			const value = this.get(key);
			this.onUpdate(key, value);
		});
	};

	public get(key: GameStoreKeys) {
		return this._store.get(key);
	}

	public set(key: GameStoreKeys, value: any) {
		this._store.set(key, value);
	}

	public setMulti(arr: Array<{ key: GameStoreKeys; value: any }>) {
		this._transact(() => {
			arr.forEach((v) => {
				console.log(v.key, v.value);
				this._store.set(v.key, v.value);
			});
		});
	}
}
