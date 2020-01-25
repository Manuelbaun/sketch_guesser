import { Subject, Subscription } from 'rxjs';
import ulog from 'ulog';
import { Player, IPlayer, IPlayerProps } from '../models';
import { PersistentStore } from '../service/sync';
import EngineInterface from './engine.interface';
import { RandomGenerator } from '../service';
import { IPlayerService } from '../service/game/player.service';

const log = ulog('player.engine');

// A Little hack to get the Subject Methods onto the PlayerEngineInterface
export interface PlayerEngineInterface extends Subject<Array<IPlayer>>, EngineInterface {
	playerNum: number;
	playerName: string;
	localID: string;

	getAllPlayers(): IPlayer[];
	isLocalPlayer(id: string): boolean;
	addLocalPlayer();
	updateLocalName(name: string);
	addLocalPoints(points: number);
	changeLocalPosition(peerId: string, x, y);
}

type PlayerEngineProps = {
	timeOutTotal: number;
	timeOutOffline: number;
};
// Now the Subject class implements the Subject interface
export class PlayerEngine extends Subject<Array<IPlayer>> implements PlayerEngineInterface {
	private _localPlayer: IPlayer;
	private _service: IPlayerService;

	public get playerNum(): number {
		return this._service.players.length;
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

	getAllPlayers(): Array<IPlayer> {
		return this._service.players;
	}

	constructor(service: IPlayerService, props: PlayerEngineProps = { timeOutTotal: 10000, timeOutOffline: 1000 }) {
		super();

		Player.timeOutTotal = props.timeOutTotal;
		Player.timeOutOffline = props.timeOutOffline;

		this._service = service;
		this._setup();
	}

	sub: Subscription;
	heartBeat;
	// setup Listeners
	_setup() {
		log.debug('PlayerEngine init');

		// pass on from
		this.sub = this._service.subscribe((player) => this.next(player));
		this.addLocalPlayer();

		// setup a keep alive interval to
		this.heartBeat = setInterval(() => {
			this._localPlayer.lastOnline = Date.now();
		}, 1000);
	}

	// calls dispose function
	dispose() {
		clearInterval(this.heartBeat);

		this.sub.unsubscribe();
	}

	public addLocalPlayer() {
		const id = PersistentStore.localID;
		const clientID = PersistentStore.clientID;
		const name = PersistentStore.localName;
		// needs to set from outside!
		const props: IPlayerProps = {
			clientID,
			id,
			name,
			lastOnline: Date.now(),
			points: 0,
			x: RandomGenerator.float({ min: 0.2, max: 0.85 }),
			y: RandomGenerator.float({ min: 0.2, max: 0.85 })
		};

		this._localPlayer = this._service.addPlayer(props);
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
}
