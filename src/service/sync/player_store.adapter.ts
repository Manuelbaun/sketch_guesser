import { PLAYER_STORE_NAME, IPlayerProps } from '../../models';
import { Map as YMap } from 'yjs';
import { CacheStoreInterface } from './cache';

// import ulog from 'ulog';

// const log = ulog('player.adapter');

export interface IPlayerStoreAdapter {
	dispose();
	has(id: string);
	setNewPlayerByProps(id: string, props: IPlayerProps): void;
	/**
	 * This function needs to be overwritten
	 */
	onPlayerUpdate: (id: string, action: string, map: any) => void;
	/**
	 * This function needs to be overwritten
	 */
	onPlayerPropsUpdate: (event, transaction) => void;
}

export class PlayerStoreAdapter {
	private _store = new YMap<any>();
	// a transaction in one batch function
	// private _transact;

	private _observer;
	private _observerDepp;

	constructor(store: CacheStoreInterface) {
		// store ref to transact.
		// this._transact = store.transact;
		// will yield map, if exits, otherwise creates it
		this._store = store.yDoc.getMap(PLAYER_STORE_NAME);

		/**
		  * This observer gets notified, when the store changes
		  * either, player gets added, updated, or removed 
		  * on the key -value level, not the actual player props
		  */
		this._observer = (event, tran) => {
			for (let [ key, changeAction ] of event.changes.keys) {
				// or should just get that key
				const map = this._store.get(key);
				this.onPlayerUpdate(key, changeAction.action, map);
			}
		};

		// this will listen also to changes on player props
		this._observerDepp = (event, tran) => {
			this.onPlayerPropsUpdate(event, tran);
		};

		this._store.observe(this._observer);
		this._store.observeDeep(this._observerDepp);
	}

	// clean up!
	dispose() {
		this._store.unobserve(this._observer);
		this._store.unobserveDeep(this._observerDepp);
	}

	/**
	 * observe if a player gets added or deleted
	 */
	onPlayerUpdate = (id: string, action: string, map: any): void => {
		console.error('TODO: FIXME, this could be a race condition', id, action, map);
		// throw new Error('Please overwrite me!');
	};

	/**
	 * a deep observe of an player property
	 */
	onPlayerPropsUpdate = (event, transaction): void => {
		console.error('TODO: FIXME, this could be a race condition', event, transaction);

		// throw new Error('plase overwrite me!');
	};

	has(id: string) {
		return this._store.has(id);
	}

	setNewPlayerByProps(id: string, props: IPlayerProps) {
		const map = new YMap<any>();
		for (let key in props) {
			map.set(key, props[key]);
		}

		this._store.set(id, map);
	}
}
