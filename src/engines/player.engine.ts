import { Subject, Subscription } from 'rxjs';
import ulog from 'ulog';
import { CacheStoreInterface } from '../storage/cache';
import { EventBusInterface } from '../service/event.bus';
import { Player, PlayerProps } from '../models';
import { PersistentStore } from '../storage';
import EngineInterface from './engine.interface';
import { RandomGenerator } from '../service';
import { PlayerStoreAdapter } from '../storage/player_store.adapter';

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
	playerTimeout: number;
};
// Now the Subject class implements the Subject interface
export class PlayerEngine extends Subject<Array<Player>> implements PlayerEngineInterface {
	private _localPlayer: Player;
	private _playerTimeout;
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
		props: PlayerEngineProps = { playerTimeout: 5000 }
	) {
		super();

		if (!cacheStore || !cacheStore.players) {
			throw new Error('Error with storage: CacheStore is null');
		}

		this._playerTimeout = props.playerTimeout;
		this._adapter = new PlayerStoreAdapter(cacheStore);
		this._eventBus = eventBus;
		this._setup();
	}

	sub: Subscription;
	_keepAlive;
	_sweepDeadPlayers;
	// setup Listeners
	_setup() {
		log.debug('PlayerEngine init');
		// subscribe
		this._eventBus.on('CONNECTION', this._peerConnectionHandler);
		// pass on from
		this.sub = this._adapter.subscribe((player) => this.next(player));
		this.addLocalPlayer();

		// setup a keep alive interval to
		this._keepAlive = setInterval(() => {
			this._localPlayer.lastOnline = Date.now();
		}, 1000);

		/** 
		 * This is a workaround until the communication server
		 * 
		 **/

		this._sweepDeadPlayers = setInterval(() => {
			const deadPlayer: string[] = [];
			this._adapter.players.forEach((player) => {
				const diff = Date.now() - player.lastOnline;
				if (diff > this._playerTimeout) {
					deadPlayer.push(player.id);
				}
			}, this._playerTimeout);

			deadPlayer.forEach((id) => this._adapter.deletePlayerById(id));
		});
	}

	// calls dispose function
	dispose() {
		this._eventBus.off('CONNECTION', this._peerConnectionHandler);
		clearInterval(this._keepAlive);
		clearInterval(this._sweepDeadPlayers);
		this.sub.unsubscribe();
	}

	_observerDeep = () => this.next(this._adapter.players);

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
			online: true,
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
		log.debug('Player online ', id);
		const player = this._adapter.getPlayerById(id);

		if (player) {
			const timer = this.offlineTimer.get(id);
			if (timer) clearTimeout(timer);

			log.debug('Player is back online');
			player.online = true;
		}
	}

	// For now, the player does not get removed, we could, be
	// we set the player just offline
	offlineTimer = new Map<string, NodeJS.Timeout>();
	setPlayerOffline(id: string) {
		const player = this._adapter.getPlayerById(id);

		log.debug('Remove Player', id, player);
		if (player) {
			// player still exits
			player.online = false;
			// let timer run, to delete player, when longer offline
			// then the player should
			const timer = setTimeout(() => {
				// player.gone = true;
				// this._adapter.deletePlayerById(id);

				this.offlineTimer.delete(id);
			}, this._playerTimeout);

			this.offlineTimer.set(id, timer); // store timer
		}
	}
}
