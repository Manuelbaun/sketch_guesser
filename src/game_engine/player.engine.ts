import * as Y from 'yjs';
import { Subject } from 'rxjs';
import Chance from 'chance';

import { CacheStoreInterface } from '../service/storage/cache';
import { EventBusInterface } from '../service/event.bus';

import { Player } from '../models';
import { PersistentStore } from '../service/storage';

export class PlayerEngine extends Subject<Array<Player>> {
	/**
	 * @type {YMap<Player>}
	 */
	private playersYMap = new Y.Map();

	public get playerNum(): number {
		return this.playersYMap.values.length;
	}

	public get playerName(): string {
		return this.localPlayer.get('name') as string;
	}

	public get localID(): string {
		return PersistentStore.clientID.toString();
	}

	getAllPlayers(): Array<Player> {
		const arr = new Array<Player>();

		this.playersYMap.forEach((player: any) => {
			let j;
			try {
				const p = {
					id: player.get('id'),
					online: player.get('online'),
					name: player.get('name'),
					points: player.get('points'),
					x: player.get('x'),
					y: player.get('y')
				};
				arr.push(p as Player);
			} catch (err) {
				console.error(player, err);
			}
		});

		return arr;
	}

	playerExists(peerId: string) {
		return this.playersYMap.has(peerId);
	}

	private _onPlayerConnection = (event) => {
		console.log(event);
		if (!event.connected) this.setPlayerOffline(event.id);
		if (event.connected) this.setPlayerOnline(event.id);
	};

	constructor(cacheStore: CacheStoreInterface, eventBus: EventBusInterface) {
		super();
		this.playersYMap = cacheStore.players;

		eventBus.on('CONNECTION', this._onPlayerConnection);

		this.playersYMap.observeDeep(() => {
			this.next(this.getAllPlayers());
		});

		console.log('PlayerEngine init');
		this.addLocalPlayer();
	}

	localPlayer = new Y.Map();
	chance;
	addLocalPlayer() {
		const id = PersistentStore.clientID.toString();
		const name = PersistentStore.localName;

		this.localPlayer = new Y.Map();
		this.chance = Chance();

		const xx = this.chance.floating({ min: 0.2, max: 0.85 });
		const yy = this.chance.floating({ min: 0.25, max: 0.75 });

		this.localPlayer.set('id', id);
		this.localPlayer.set('online', true);
		this.localPlayer.set('name', name);
		this.localPlayer.set('points', 0);
		this.localPlayer.set('x', xx);
		this.localPlayer.set('y', yy);

		this.playersYMap.set(id, this.localPlayer);
	}

	updateLocalName(name: string) {
		// update sessionStorage
		PersistentStore.localName = name;
		this.chance = Chance(name);
		this.localPlayer.set('name', name);
	}

	addLocalPoints(points: number) {
		const _points = (this.localPlayer.get('points') as number) + points;
		this.localPlayer.set('points', _points);
	}

	changeLocalPosition(peerId: string, x, y) {
		if (this.localID === peerId) {
			this.localPlayer.doc &&
				this.localPlayer.doc.transact(() => {
					this.localPlayer.set('x', x);
					this.localPlayer.set('y', y);
				});
		}
	}

	setPlayerOnline(id) {
		console.log('Player online ', id);
		// this.playersYMap.forEach((p: any) => {});
	}

	// For now, the player does not get removed, we could, be
	// we set the player just offline
	setPlayerOffline(id: string) {
		console.log('Remove Player', id);
		this.playersYMap.delete(id);
	}
}
