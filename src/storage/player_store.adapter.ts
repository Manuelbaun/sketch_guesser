import { PlayerProps, Player } from '../models';
import { Map as YMap } from 'yjs';
import ulog from 'ulog';
import { CacheStoreInterface } from '../service';
import { Subject } from 'rxjs';

const log = ulog('player.adapter');

export class PlayerStoreAdapter extends Subject<Array<Player>> {
	store = new YMap<any>();
	private _playerMap = new Map<string, Player>();

	get players(): Array<Player> {
		return Array.from(this._playerMap.values());
	}

	observer;
	observerDepp;

	constructor(store: CacheStoreInterface) {
		super();
		log.debug(store.players);
		this.store = store.players;

		/**
		  * This observer gets notified, when the store changes
		  * either, player gets added, updated, or removed 
		  * on the key -value level, not the actual player props
		  */
		this.observer = (event, tran) => {
			log.debug('Transaction happend local :', tran);

			for (let [ key, changeAction ] of event.changes.keys) {
				log.debug(key, changeAction);
				if (changeAction.action === 'add') {
					this._convertYMapIntoPlayerClass(key);
				}

				if (changeAction.action === 'delete') {
					// log.debug('other action');
				}
			}
		};

		// this will listen also to changes on player props
		this.observerDepp = (event, tran) => {
			const player = this.players.filter((player) => !player.gone);
			this.next(player);
		};

		this.store.observe(this.observer);
		this.store.observeDeep(this.observerDepp);
	}

	// clean up!
	dispose() {
		this.store.unobserve(this.observer);
		this.store.unobserveDeep(this.observerDepp);
	}

	// sets player with id define in props, or return
	// the player with the prop
	addPlayer(props: PlayerProps): Player {
		if (this.store.has(props.id)) {
			log.debug('User already exits with id', props.id);

			// @ts-ignore
			return this._playerMap.get(props.id);
		}

		log.debug('add local Player with name:', props.name);

		const player = new Player(props);
		this._playerMap.set(props.id, player);
		this.store.set(props.id, player.map);
		return player;
	}

	getPlayerById(id: string): Player | undefined {
		log.debug('get local Player with name:', id);
		let player = this._playerMap.get(id);
		if (!player) {
			player = this._convertYMapIntoPlayerClass(id);
		}
		return player;
	}

	/**
	 * this function converts a map, which is already in the store 
	 * into an Player Object for this peer by the given ID
	 * 
	 * this function assumes, that such a map with the key of ID
	 * exits!
	 * 
	 * @param  id 
	 */
	private _convertYMapIntoPlayerClass(id: string) {
		// convert from map to a player class
		const playerYMap = this.store.get(id);
		let player;
		if (playerYMap) {
			player = Player.fromYMap(id, playerYMap);
			this._playerMap.set(id, player);
		}
		return player;
	}

	// This function will be triggerd, when a remote peer deletes
	// the player from the store
	private _deletePlayerByID(id) {
		this._playerMap.delete(id);
	}

	// this function can be called from the local peer
	deletePlayerById(id: string) {
		this._playerMap.delete(id);
		this.store.delete(id);
	}
}
