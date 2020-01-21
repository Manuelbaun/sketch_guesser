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
		return PersistentStore.localID;
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
		if (!event.connected) this.removePlayer(event.peerId);
	};

	constructor(cacheStore: CacheStoreInterface, eventBus: EventBusInterface) {
		super();
		this.playersYMap = cacheStore.players;

		eventBus.on('CONNECTION', this._onPlayerConnection);

		this.playersYMap.observeDeep(() => {
			this.next(this.getAllPlayers());
		});

		console.log('PlayerEngine init');
		this.addPlayer(this.localID, PersistentStore.localName, 0.5, 0.5);
	}

	localPlayer = new Y.Map();
	chance;
	addPlayer(peerId: string, name: string, x?: number, y?: number) {
		const player = this.playersYMap.get(peerId) as Player;
		if (player) return;
		this.chance = Chance();

		const xx = this.chance.floating({ min: 0.2, max: 0.85 });
		const yy = this.chance.floating({ min: 0.25, max: 0.75 });

		this.localPlayer.set('id', peerId);
		this.localPlayer.set('online', true);
		//@ts-ignore
		this.localPlayer.set('doc_id', this.playersYMap.doc.clientID);

		this.localPlayer.set('name', name);
		this.localPlayer.set('points', 0);
		this.localPlayer.set('x', xx);
		this.localPlayer.set('y', yy);
		this.playersYMap.set(peerId, this.localPlayer);
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

	// For now, the player does not get removed, we could, be
	// we set the player just offline
	removePlayer(peerId: string) {
		// const player = this.playersYMap.get(peerId) as Player;
		// if (!player) return;
		// this.playersYMap.delete(peerId);

		this.playersYMap.forEach((p: any) => {
			if (p.get('doc_id') == peerId) {
				p.set('online', false);
			}
		});
	}
}
