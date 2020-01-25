import * as Y from 'yjs';

export interface IPlayerProps {
	id: string; // this is the peer id
	clientID: number; // this is the yjs doc id, possible removable
	name: string;
	points: number;
	lastOnline: number;
	x: number; // between 0 and 1 => normalized
	y: number; // between 0 and 1
}

export enum PlayerMapKeys {
	ID = 'id',
	CLIENT_ID = 'clientID',
	NAME = 'name',
	POINTS = 'points',
	LAST_ONLINE = 'lastOnline',
	X = 'x',
	Y = 'y'
}

export interface IPlayer extends IPlayerProps {
	gone(): boolean;
	online(): boolean;
	onChange(f: (event) => void): void;
	offChange(f: (event) => void): void;
}

export const PLAYER_STORE_NAME = 'players';
/**
 * 
 * This class Wraps the YMap 
 * to hide the setter and getter 
 * 
 * Settings on of the attributes, will trigger 
 * y-js and send the changes to all peers
 */
export class Player implements IPlayer {
	private _map = new Y.Map<any>();

	/**
	 * time, when in the player lost connection, and
	 * is probably not gone
	 */
	static timeOutOffline = 1000;
	/**
	 * the time, when the player is definitely left the game 
	 */
	static timeOutTotal = 10000; //

	constructor(map) {
		this._map = map;
	}

	onChange(f: (event: any) => void): void {
		this._map.observe(f);
	}

	offChange(f: (event: any) => void): void {
		this._map.unobserve(f);
	}

	toJSON() {
		return this._map.toJSON();
	}

	public get map() {
		return this._map;
	}

	// indicates that the player is online, maybe an glitch or so
	public online(): boolean {
		return Date.now() - this.lastOnline < Player.timeOutOffline;
	}

	// indicates that the player is not online anymore and gone...
	public gone(): boolean {
		return Date.now() - this.lastOnline > Player.timeOutTotal;
	}

	public set lastOnline(ts: number) {
		this._map.set(PlayerMapKeys.LAST_ONLINE, ts);
	}

	public get lastOnline(): number {
		return this._map.get(PlayerMapKeys.LAST_ONLINE);
	}

	public get id(): string {
		return this._map.get(PlayerMapKeys.ID);
	}

	public get clientID(): number {
		return this._map.get(PlayerMapKeys.CLIENT_ID);
	}

	public get name(): string {
		return this._map.get(PlayerMapKeys.NAME) as string;
	}

	public set name(name: string) {
		this._map.set(PlayerMapKeys.NAME, name);
	}

	public get x() {
		return this._map.get(PlayerMapKeys.X);
	}
	public set x(value: number) {
		this._map.set(PlayerMapKeys.X, value);
	}

	public get y(): number {
		return this._map.get(PlayerMapKeys.Y) as number;
	}
	public set y(value: number) {
		this._map.set(PlayerMapKeys.Y, value);
	}

	public get points(): number {
		return this._map.get(PlayerMapKeys.POINTS) as number;
	}
	public set points(value: number) {
		this._map.set(PlayerMapKeys.POINTS, value);
	}
}
