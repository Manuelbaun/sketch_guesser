import { Subject } from 'rxjs';

import { CacheStoreInterface } from '../service/storage/cache';
import { CommunicationServiceInterface } from '../service/communication/communication.types';
import { Player } from '../models';
import { EventBusInterface, EventBusType } from '../service/event.bus';
import Chance from 'chance';

export class PlayerEngine extends Subject<Array<Player>> {
	private _localID: string;
	private playersYMap;
	localName: string;

	public get playerNum(): number {
		return this.playersYMap.values.length;
	}

	public get localID(): string {
		return this._localID;
	}

	getAllPlayers(): Array<Player> {
		const allPlayers = this.playersYMap.values();
		return Array.from(allPlayers);
	}

	playerExists(peerId: string) {
		return this.playersYMap.has(peerId);
	}

	private _onPlayerConnection = (event) => {
		// console.log(event);
		if (!event.connected) this.removePlayer(event.peerId);
		//this.addPlayer(event.peerId);
	};

	constructor(cache: CacheStoreInterface, comm: CommunicationServiceInterface, eventBus: EventBusInterface) {
		super();
		this.playersYMap = cache.players;
		this._localID = comm.localID;

		const chance = Chance(this._localID);
		this.localName = chance.name();

		eventBus.on(EventBusType.CONNECTION, this._onPlayerConnection);
		console.log('PlayerEngine init');

		this.playersYMap.observe(() => {
			this.next(this.getAllPlayers());
		});

		this.addPlayer(this.localID, this.localName);
	}

	addPlayer(peerId: string, name: string) {
		const player = this.playersYMap.get(peerId) as Player;
		if (player) return;

		const p = {
			id: peerId,
			name: name,
			points: 0
		};
		this.playersYMap.set(peerId, p);
	}

	updateLocalName(name: string) {
		this.localName = name;
		const player = this.playersYMap.get(this.localID) as Player;
		this.update(this.localID, {
			...player,
			name: name
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
