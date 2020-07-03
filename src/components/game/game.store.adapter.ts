import { Map as YMap } from 'yjs';
import { GameStorePort } from './game_store.port';
import { CacheStoreSyncInterface } from '../../service';
import { GAME_STORE_NAME, GameModelProp, GameModel, GameModelKeys } from './game.model';



export class GameStoreAdapter implements GameStorePort {
	private _store = new YMap<GameModel>();
	private _transact;

	constructor(store: CacheStoreSyncInterface) {
		this._store = store.yDoc.getMap(GAME_STORE_NAME);
		this._transact = store.transact;
		this._store.observe(this._observer);
	}

	/**
	 * This observer gets notified, when the store changes
	 * either, player gets added, updated, or removed
	 * on the key -value level, not the actual player props
	 */
	_observer = (event, tran): void => {
		// console.log(tran);
		// or should just get that key
		for (const [key] of event.changes.keys) {
			const value = this._store.get(key);
			// console.log(key, changeAction.action, value);
			this._updateListener({ [key]: value });
		}
	};

	dispose(): void {
		this._store.unobserve(this._observer);
	}

	updateProp(props: Partial<GameModelProp>): void {
		this._transact(() => {
			const obj = Object.entries(props);
			// @ts-ignore
			obj.forEach(([key, value]) => this._store.set(key, value));
		});
	}

	get<K extends GameModelKeys>(key: K): GameModel[K] | undefined {
		return this._store.get(key) as GameModel[K] | undefined;
	}

	set<K extends GameModelKeys>(key: K, value: GameModel[K]): void {
		// @ts-ignore need to ignore, since the jsdoc annotation is not
		// right within the yjs library
		this._store.set(key, value);
	}

	/**
     * Override this function
     */
	private _updateListener = (prop: Partial<GameModelProp>): void => {
		this.set('round', 1);
		throw Error('Hey, nobody is listening to me!');
	};

	/**
	 * Use this to override the _updateListener function
	 * @param f Function callback 
	 */
	onUpdate(f: (prop: GameModelProp) => void): void {
		this._updateListener = f;
	}
}
