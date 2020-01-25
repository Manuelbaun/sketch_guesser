import { IPlayer, Player, IPlayerProps } from '../../models';
import { Subject } from 'rxjs';
import { PlayerStoreAdapter } from '../sync/player_store.adapter';
import { IService } from './i.service';

export interface IPlayerService extends IService<Array<IPlayer>> {
	players: Array<IPlayer>;
	addPlayer(props: IPlayerProps);
}

export class PlayerService extends Subject<Array<IPlayer>> implements IPlayerService {
	private _adapter: PlayerStoreAdapter;

	// cache of the players..
	private _playerMap = new Map<string, IPlayer>();

	constructor(adapter: PlayerStoreAdapter) {
		super();
		this._adapter = adapter;

		// this here keeps the _playerMap and the _adapter yjs map in
		// sync
		this._adapter.onPlayerUpdate = (id, action, map) => {
			console.log(id, action, map);
			if (action === 'add') {
				const player = new Player(map);
				this._playerMap.set(id, player);
			} else if (action === 'delete') {
				// DO something her, need to set null?
				this._playerMap.delete(id);
			}

			this.next(this.players);
		};

		this._adapter.onPlayerPropsUpdate = (event, transactio) => {
			// just send an update to all

			const player = this.players.filter((player) => !player.gone());
			this.next(player);
			// if (player.length != this.players.length) { }
		};
	}

	get players(): Array<IPlayer> {
		return Array.from(this._playerMap.values());
	}
	// sets player with id define in props, or return
	// the player with the prop
	addPlayer(props: IPlayerProps) {
		if (!this._adapter.has(props.id)) {
			this._adapter.setNewPlayerByProps(props.id, props);
		}

		// TODO: return the player with the key
		const player = this._playerMap.get(props.id);
		console.log('Player Added and returned', player);
		return player;
	}

	getPlayerById(id: string): IPlayer | undefined {
		return this._playerMap.get(id);
	}
}
