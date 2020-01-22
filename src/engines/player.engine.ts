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
	isLocalPlayer(id: string): boolean;
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

type PlayerEngineProps = {
	playerTimeout: number;
};
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

	public isLocalPlayer(id: string) {
		return PersistentStore.localID == id;
	}
	public get localID(): string {
		return PersistentStore.localID;
	}

	getAllPlayers(): Array<Player> {
		const arr = new Array<Player>();

		this.store.forEach((player: any) => {
			// This here, could be toJSON
			try {
				const p = {
					id: player.get('id'),
					clientID: player.get('doc_id'),
					online: player.get('online'),
					gone: player.get('gone'),
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

	private _onPlayerConnectionHandler = (event) => {
		if (!event.connected) this.setPlayerOffline(event.id);
		if (event.connected) this.setPlayerOnline(event.id);
	};

	private _observerDeep;
	private _localPlayer = new Y.Map();
	private _chance;
	private _playerTimeout;

	constructor(cacheStore: CacheStoreInterface, eventBus: EventBusInterface, { playerTimeout = 5000 } = {}) {
		super();

		this._playerTimeout = playerTimeout;
		this.store = cacheStore.players;

		eventBus.on('CONNECTION', this._onPlayerConnectionHandler);

		this._observerDeep = () => this.next(this.getAllPlayers());
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
		const id = PersistentStore.localID;
		const docId = PersistentStore.clientID;
		const name = PersistentStore.localName;

		this._localPlayer = new Y.Map();
		this._chance = Chance();

		const xx = this._chance.floating({ min: 0.2, max: 0.85 });
		const yy = this._chance.floating({ min: 0.25, max: 0.75 });

		this._localPlayer.set('id', id);
		this._localPlayer.set('doc_id', docId);
		this._localPlayer.set('online', true);
		// workaround for delete
		this._localPlayer.set('gone', false);

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
		let p = new Y.Map();
		//@ts-ignore
		p = this.store.get(id);
		if (p) {
			const timer = this.offlineTimer.get(id);
			p.set('online', true);
			// delete workround
			p.set('gone', false);
			console.log('Player is back online');

			if (timer) {
				clearTimeout(timer);
			}
		}
	}

	// For now, the player does not get removed, we could, be
	// we set the player just offline
	offlineTimer = new Map<string, NodeJS.Timeout>();
	setPlayerOffline(id: string) {
		console.log('Remove Player', id);
		let p = new Y.Map();
		//@ts-ignore
		p = this.store.get(id);

		if (p) {
			p.set('online', false);

			// let timer run, to delete player, when longer offline
			// then the player should
			const timer = setTimeout(() => {
				// TODO: Delete and readd does not work
				// some sync issue, because of a missing update package
				// via yjs. For now, just set offline is fine!
				// this.store.delete(id);
				// workaround for the delete
				p.set('gone', true);
				this.offlineTimer.delete(id);
			}, this._playerTimeout);

			// store timer
			this.offlineTimer.set(id, timer);
		}
	}
}
