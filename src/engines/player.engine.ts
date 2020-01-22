import * as Y from 'yjs';
import { Subject } from 'rxjs';
import Chance from 'chance';

import { CacheStoreInterface } from '../service/storage/cache';
import { EventBusInterface } from '../service/event.bus';

import { Player } from '../models';
import { PersistentStore } from '../service/storage';
import EngineInterface from './engine.interface';

// A Little hack to get the Subject Methods onto the PlayerEngineInterface
export interface PlayerEngineInterface extends Subject<Array<Player>> {
	playerNum: number;

	playerName: string;

	localID: string;

	getAllPlayers(): Player[];

	playerExists(peerId: string): boolean;

	addLocalPlayer();

	updateLocalName(name: string);

	addLocalPoints(points: number);

	changeLocalPosition(peerId: string, x, y);

	setPlayerOnline(id);

	// For now, the player does not get removed, we could, be
	// we set the player just offline
	setPlayerOffline(id: string);
}

// Now the Subject class implements the Subject interface
export class PlayerEngine extends Subject<Array<Player>> implements PlayerEngineInterface, EngineInterface {
	/**
	 * @type {YMap<Player>}
	 */
	private store = new Y.Map();

	public get playerNum(): number {
		return this.store.values.length;
	}

	public get playerName(): string {
		return this._localPlayer.get('name') as string;
	}

	public get localID(): string {
		return PersistentStore.clientID.toString();
	}

	getAllPlayers(): Array<Player> {
		const arr = new Array<Player>();

		this.store.forEach((player: any) => {
			// This here, could be toJSON
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

	private _onPlayerConnection = (event) => {
		console.log(event);
		if (!event.connected) this.setPlayerOffline(event.id);
		if (event.connected) this.setPlayerOnline(event.id);
	};

	private _observerDeep;
	private _localPlayer = new Y.Map();
	private _chance;
	constructor(cacheStore: CacheStoreInterface, eventBus: EventBusInterface) {
		super();
		this.store = cacheStore.players;

		eventBus.on('CONNECTION', this._onPlayerConnection);
		this._observerDeep = () => {
			this.next(this.getAllPlayers());
		};
		this.store.observeDeep(this._observerDeep);

		console.log('PlayerEngine init');
		this.addLocalPlayer();
	}

	dispose() {
		this.store.unobserveDeep(this._observerDeep);
	}

	public playerExists(peerId: string) {
		return this.store.has(peerId);
	}

	public addLocalPlayer() {
		const id = PersistentStore.clientID.toString();
		const name = PersistentStore.localName;

		this._localPlayer = new Y.Map();
		this._chance = Chance();

		const xx = this._chance.floating({ min: 0.2, max: 0.85 });
		const yy = this._chance.floating({ min: 0.25, max: 0.75 });

		this._localPlayer.set('id', id);
		this._localPlayer.set('online', true);
		this._localPlayer.set('name', name);
		this._localPlayer.set('points', 0);
		this._localPlayer.set('x', xx);
		this._localPlayer.set('y', yy);

		this.store.set(id, this._localPlayer);
	}

	updateLocalName(name: string) {
		// update sessionStorage
		PersistentStore.localName = name;
		this._chance = Chance(name);
		this._localPlayer.set('name', name);
	}

	addLocalPoints(points: number) {
		const _points = (this._localPlayer.get('points') as number) + points;
		this._localPlayer.set('points', _points);
	}

	changeLocalPosition(peerId: string, x, y) {
		if (this.localID === peerId) {
			this._localPlayer.doc &&
				this._localPlayer.doc.transact(() => {
					this._localPlayer.set('x', x);
					this._localPlayer.set('y', y);
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
		this.store.delete(id);
	}
}
