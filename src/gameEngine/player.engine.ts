import { Subject } from 'rxjs';

import { CacheStoreInterface } from '../service/storage/cache';
import { EventBusInterface } from '../service/event.bus';

import { Player } from '../models';
import { PersistentStore } from '../service/storage';

export class PlayerEngine extends Subject<Array<Player>> {
	private playersYMap;

	public get playerNum(): number {
		return this.playersYMap.values.length;
	}

	public get playerName(): string {
		return (this.playersYMap.get(this.localID) as Player).name;
	}

	public get localID(): string {
		return PersistentStore.localID;
	}

	getAllPlayers(): Array<Player> {
		const allPlayers = this.playersYMap.values();
		return Array.from(allPlayers);
	}

	playerExists(peerId: string) {
		return this.playersYMap.has(peerId);
	}

	private _onPlayerConnection = (event) => {
		if (!event.connected) this.removePlayer(event.peerId);
		//this.addPlayer(event.peerId);
	};

	constructor(cache: CacheStoreInterface, eventBus: EventBusInterface) {
		super();
		this.playersYMap = cache.players;

		eventBus.on('CONNECTION', this._onPlayerConnection);

		this.playersYMap.observe(() => {
			this.next(this.getAllPlayers());
		});

		console.log('PlayerEngine init');
		this.addPlayer(this.localID, PersistentStore.localName);
	}

	addPlayer(peerId: string, name: string) {
		const player = this.playersYMap.get(peerId) as Player;
		if (player) return;

		const p = {
			id: peerId,
			name,
			points: 0
		};
		this.playersYMap.set(peerId, p);
	}

	updateLocalName(name: string) {
		// update sessionStorage
		PersistentStore.localName = name;

		const player = this.playersYMap.get(this.localID) as Player;
		this.update(this.localID, {
			...player,
			name
		});
	}

	private update(peerId: string, p: Player) {
		const player = this.playersYMap.get(peerId) as Player;

		if (!player) return;

		this.playersYMap.set(peerId, {
			id: peerId,
			name: p.name,
			points: p.points || 0
		});
	}

	addLocalPoints(points: number) {
		this.addPoints(this.localID, points);
	}

	addPoints(peerId: string, points: number) {
		const player = this.playersYMap.get(peerId) as Player;
		if (!player) return;

		this.playersYMap.set(peerId, {
			...player,
			points: player.points + points
		});
	}

	removePlayer(peerId: string) {
		const player = this.playersYMap.get(peerId) as Player;
		if (!player) return;

		this.playersYMap.delete(peerId);
	}
}
