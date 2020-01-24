import { Subject, Subscription } from 'rxjs';
import ulog from 'ulog';
import { CacheStoreInterface } from '../service/sync/cache';
import { EventBusInterface } from '../service/event.bus';
import { Player, PlayerProps } from '../models';
import { PersistentStore } from '../service/sync';
import EngineInterface from './engine.interface';
import { RandomGenerator } from '../service';
import { PlayerStoreAdapter } from '../service/sync/player_store.adapter';

const log = ulog('player.engine');

// A Little hack to get the Subject Methods onto the PlayerEngineInterface
export interface PlayerEngineInterface extends Subject<Array<Player>>, EngineInterface {
	playerNum: number;
	playerName: string;
	localID: string;

	getAllPlayers(): Player[];
	isLocalPlayer(id: string): boolean;
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
	timeOutTotal: number;
	timeOutOffline: number;
};
// Now the Subject class implements the Subject interface
export class PlayerEngine extends Subject<Array<Player>> implements PlayerEngineInterface {
	private _localPlayer: Player;
	private _eventBus: EventBusInterface;
	private _adapter: PlayerStoreAdapter;

	public get playerNum(): number {
		return this._adapter.players.length;
	}

	public get playerName(): string {
		return this._localPlayer.name;
	}

	public isLocalPlayer(id: string) {
		return PersistentStore.localID === id;
	}

	public get localID(): string {
		return PersistentStore.localID;
	}

	getAllPlayers(): Array<Player> {
		return this._adapter.players;
	}

	constructor(
		cacheStore: CacheStoreInterface,
		eventBus: EventBusInterface,
		props: PlayerEngineProps = { timeOutTotal: 10000, timeOutOffline: 1000 }
	) {
		super();

		if (!cacheStore || !cacheStore.players) {
			throw new Error('Error with storage: CacheStore is null');
		}

		Player.timeOutTotal = props.timeOutTotal;
		Player.timeOutOffline = props.timeOutOffline;

		this._adapter = new PlayerStoreAdapter(cacheStore);
		this._eventBus = eventBus;
		this._setup();
	}

	sub: Subscription;
	heartBeat;
	// setup Listeners
	_setup() {
		log.debug('PlayerEngine init');
		// subscribe
		this._eventBus.on('CONNECTION', this._peerConnectionHandler);
		// pass on from
		this.sub = this._adapter.subscribe((player) => this.next(player));
		this.addLocalPlayer();

		// setup a keep alive interval to
		this.heartBeat = setInterval(() => {
			this._localPlayer.lastOnline = Date.now();
		}, 1000);
	}

	// calls dispose function
	dispose() {
		clearInterval(this.heartBeat);
		this._eventBus.off('CONNECTION', this._peerConnectionHandler);
		this.sub.unsubscribe();
	}

	_peerConnectionHandler = (event) => {
		if (!event.connected) this.setPlayerOffline(event.id);
		if (event.connected) this.setPlayerOnline(event.id);
	};

	public addLocalPlayer() {
		const id = PersistentStore.localID;
		const clientID = PersistentStore.clientID;
		const name = PersistentStore.localName;
		// needs to set from outside!
		const props: PlayerProps = {
			clientID,
			id,
			name,
			lastOnline: Date.now(),
			points: 0,
			x: RandomGenerator.float({ min: 0.2, max: 0.85 }),
			y: RandomGenerator.float({ min: 0.2, max: 0.85 })
		};

		this._localPlayer = this._adapter.addPlayer(props);
	}

	updateLocalName(name: string) {
		// update sessionStorage
		PersistentStore.localName = name;
		this._localPlayer.name = name;
		log.debug('update local player name:', name);
	}

	addLocalPoints(points: number) {
		this._localPlayer.points += points;
		log.debug('add local Player points:', points);
	}

	changeLocalPosition(peerId: string, x, y) {
		if (this.localID === peerId) {
			this._localPlayer.x = x;
			this._localPlayer.y = y;
		}
	}

	setPlayerOnline(id) {
		const player = this._adapter.getPlayerById(id);
		log.debug('Player is online ', id, player);
	}

	// For now, the player does not get removed, we could, be
	// we set the player just offline
	setPlayerOffline(id: string) {
		const player = this._adapter.getPlayerById(id);
		log.debug('Player is Offline', id, player);
	}
}
