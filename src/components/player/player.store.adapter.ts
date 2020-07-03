import { Map as YMap } from 'yjs';
import { PlayerStorePort } from './player.store.port';
import { PlayerModel, PlayerProps } from './player.model';
import { CacheStoreSyncInterface, PersistentStore } from '../../service';


export class PlayerStoreAdapter implements PlayerStorePort {
	private _store = new YMap<YMap<PlayerModel>>();
	private _transact;

	constructor(store: CacheStoreSyncInterface) {
		this._store = store.yDoc.getMap('player');

		this._transact = store.transact;
		this._store.observe(this._observer);
		this._store.observeDeep(this._onPlayerUpdate);
	}

	/**
	 * This observer gets notified, when the store changes
	 * either, player gets added, updated, or removed
	 * on the key -value level, not the actual player props
	 */
	_observer = (event, tran) => {
		// or should just get that key
		for (const [key, changeAction] of event.changes.keys) {
			const map = this._store.get(key);
			console.log(key, changeAction.action, map);
		}
	};

	dispose(): void {
		this._store.unobserveDeep(this._onPlayerUpdate);
		this._store.unobserve(this._observer);
	}

	/**
     * Override this function
     */
	private _updateLister = (p: Map<string, PlayerModel>): void => {
		throw Error('Nobody is Listen to me!');
	};

	// converts form yjs-map to normal map
	private _onPlayerUpdate = (): void => {
		const players = new Map<string, PlayerModel>();

		this._store.forEach((player, key) => {
			players.set(key, player.toJSON() as PlayerModel);
		});

		this._updateLister(players);
	};

	/**
     *  Function operates only on local player!
     */
	add(player: PlayerModel): PlayerModel {
		const p = new YMap<PlayerModel>();

		player.id = PersistentStore.id;

		// update in a batch
		this._transact(() => {
			const obj = Object.entries(player);
			obj.forEach(([key, value]) => p.set(key, value));
		});

		this._store.set(PersistentStore.id.toString(), p);
		return player;
	}

	/**
     * Function operates only on local player!
     */
	updateProp(props: PlayerProps): void {
		const p = this._store.get(PersistentStore.id.toString());

		if (p) {
			// update in a batch
			this._transact(() => {
				const obj = Object.entries(props);

				obj.forEach(([key, value]) => {
					p.set(key, value);
				});
			});
		}
	}

	onUpdate(handler: (players: Map<string, PlayerModel>) => void): void {
		this._updateLister = handler;
	}
}
