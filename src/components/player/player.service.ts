import { PlayerStorePort } from './player.store.port';
import { PlayerModel, Player } from './player.model';
import { Subject } from 'rxjs';
import { PlayerServiceInterface } from './player.service.interface';

/**
 * This Player Service operates only the local Player, hence, no Id is needed
 */
export class PlayerService implements PlayerServiceInterface {
	private _map = new Map<string, PlayerModel>();
	private _adapter: PlayerStorePort;
	private _localPlayer: PlayerModel;
	private _subject = new Subject<Player[]>();
	private _heartBeat;

	get subject(): Subject<Player[]> {
		return this._subject;
	}

	get players(): Player[] {
		const players: Player[] = [];

		for (const p of Array.from(this._map.values())) {
			players.push(new Player(p));
		}
		return players;
	}

	isLocalPlayer(id: number): boolean {
		return id === this._localPlayer.id;
	}

	constructor(adapter: PlayerStorePort) {
		this._adapter = adapter;

		this._adapter.onUpdate((players) => {
			this._map = players;
			this._subject.next(this.players);
		});
	}

	dispose(): void {
		clearInterval(this._heartBeat);
	}

	create(name: string): void {
		// should only be called once
		if (this._localPlayer) return;

		this._localPlayer = this._adapter.add({
			lastOnline: Date.now(),
			name: name,
			points: 0,
			id: 0
		});

		clearInterval(this._heartBeat);
		// setup a keep alive interval to
		this._heartBeat = setInterval(() => {
			this._adapter.updateProp({
				lastOnline: Date.now()
			});
		}, 1000);
	}

	updateName(name: string): void {
		this._adapter.updateProp({ name });
	}

	addPoints(points: number): void {
		this._adapter.updateProp({
			points: this._localPlayer.points + points
		});
	}
}
