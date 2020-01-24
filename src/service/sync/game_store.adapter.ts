import { Observable } from 'lib0/observable';
import { Map as YMap } from 'yjs';
import ulog from 'ulog';
import { CacheStoreInterface } from './cache';

// const log = ulog('Game-Store-Adapter');
type GameStoreAdapterEvents = 'update';

export interface IGameStoreAdapter extends Observable<GameStoreAdapterEvents> {
	set(key: string, value: any);
	setProps(arr: Array<IKeyValue>);
	get(key: string);
}

export interface IKeyValue {
	key: string;
	value: any;
}

export class GameStoreAdapter extends Observable<GameStoreAdapterEvents> implements IGameStoreAdapter {
	private _store = new YMap<any>();

	// a transaction in one batch function
	_transact;

	constructor(store: CacheStoreInterface) {
		super();

		// store ref to transact.
		this._transact = store.yDoc.transact;
		// log.debug(store.hasGameState);
		// checks before calling gameState! calling Gamestate
		// will create a new map or yield an existing one.
		// therefore check if it exits before
		// if not, then setting props must happen, otherwise not
		// TODO: Check if game exits
		const gameStateDidExist = store.yDoc.share.has('gameState');

		// creates the Map of GameState, if exits, it will yield the exiting one
		this._store = store.yDoc.getMap('gameState');
		// Observe the changes on that map
		this._store.observe(this._observeHandler);

		// TODO:
		// The creator of the first gamestate will be the
		// master for the first round
		if (!gameStateDidExist) {
			console.log('Game did not exist');
		}
	}

	// TODO: do a proper type
	private _observeHandler = (event, transation) => {
		// console.log(event, transation);

		Array.from<string>(event.keysChanged).forEach((key) => {
			const value = this.get(key);
			console.log(key, value);
			this.emit('update', [ { key, value } ]);
		});
	};

	dispose() {
		this._store.unobserve(this._observeHandler);
		// super.destroy()
	}

	public set(key: string, value: any) {
		this._store.set(key, value);
	}

	public setProps(arr: Array<IKeyValue>) {
		this._transact(() => {
			arr.forEach((v) => {
				console.log(v.key, v.value);
				this._store.set(v.key, v.value);
			});
		});
	}

	public get(key: string) {
		return this._store.get(key);
	}
}
