import * as Y from 'yjs';
import { Subject } from 'rxjs';
import ulog from 'ulog';
import { CacheStoreInterface } from '../storage/cache';
import { EventBusInterface } from '../service/event.bus';
import { Player } from '../models';
import { PersistentStore } from '../storage';
import EngineInterface from './engine.interface';
import { RandomGenerator } from '../service';

const log = ulog('player.engine');

// A Little hack to get the Subject Methods onto the PlayerEngineInterface
export interface PlayerEngineInterface extends Subject<Array<Player>>, EngineInterface {
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
export class PlayerEngine extends Subject<Array<Player>> implements PlayerEngineInterface {
	/**
	 * @type {YMap<Player>}
	 */
	private _store = new Y.Map();

	public get playerNum(): number {
		return this._store.values.length;
	}

	public get playerName(): string {
		return this._localPlayer.get('name') as string;
	}

	public isLocalPlayer(id: string) {
		return PersistentStore.localID === id;
	}
	public get localID(): string {
		return PersistentStore.localID;
	}

	getAllPlayers(): Array<Player> {
		const arr = new Array<Player>();

		this._store.forEach((player: any) => {
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
				log.error(player, err);
			}
		});

		return arr;
	}

	private _localPlayer = new Y.Map();
	private _playerTimeout;
	private _eventBus: EventBusInterface;

	constructor(
		cacheStore: CacheStoreInterface,
		eventBus: EventBusInterface,
		props: PlayerEngineProps = { playerTimeout: 5000 }
	) {
		super();

		this._playerTimeout = props.playerTimeout;
		this._store = cacheStore.players;
		this._eventBus = eventBus;
		this._setup();
	}

	// setup Listeners
	_setup() {
		log.debug('PlayerEngine init');
		// subscribe
		this._eventBus.on('CONNECTION', this._peerConnectionHandler);
		this._store.observeDeep(this._observerDeep);

		this.addLocalPlayer();
	}

	// calls dispose function
	dispose() {
		this._store.unobserveDeep(this._observerDeep);
		this._eventBus.off('CONNECTION', this._peerConnectionHandler);
	}

	_observerDeep = () => this.next(this.getAllPlayers());

	_peerConnectionHandler = (event) => {
		if (!event.connected) this.setPlayerOffline(event.id);
		if (event.connected) this.setPlayerOnline(event.id);
	};

	public playerExists(peerId: string) {
		return this._store.has(peerId);
	}

	public addLocalPlayer() {
		const id = PersistentStore.localID;
		const docId = PersistentStore.clientID;
		const name = PersistentStore.localName;

		this._localPlayer = new Y.Map();

		const xx = RandomGenerator.float({ min: 0.2, max: 0.85 });
		const yy = RandomGenerator.float({ min: 0.2, max: 0.85 });

		this._localPlayer.set('id', id);
		this._localPlayer.set('doc_id', docId);
		this._localPlayer.set('online', true);
		this._localPlayer.set('name', name);
		this._localPlayer.set('points', 0);
		this._localPlayer.set('x', xx);
		this._localPlayer.set('y', yy);

		// workaround for delete
		this._localPlayer.set('gone', false);

		this._store.set(id, this._localPlayer);
		log.debug('add local Player with name:', name);
	}

	updateLocalName(name: string) {
		// update sessionStorage
		PersistentStore.localName = name;
		this._localPlayer.set('name', name);
		log.debug('update local player name:', name);
	}

	addLocalPoints(points: number) {
		const _points = (this._localPlayer.get('points') as number) + points;
		this._localPlayer.set('points', _points);
		log.debug('add local Player points:', points);
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
		log.debug('Player online ', id);
		let p = new Y.Map();
		//@ts-ignore
		p = this._store.get(id);
		if (p) {
			const timer = this.offlineTimer.get(id);
			p.set('online', true);
			// delete workround
			p.set('gone', false);
			log.debug('Player is back online');

			if (timer) {
				clearTimeout(timer);
			}
		}
	}

	// For now, the player does not get removed, we could, be
	// we set the player just offline
	offlineTimer = new Map<string, NodeJS.Timeout>();
	setPlayerOffline(id: string) {
		log.debug('Remove Player', id);
		let p = new Y.Map();
		//@ts-ignore
		p = this._store.get(id);

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
