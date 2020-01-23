import * as Y from 'yjs';

export type PlayerProps = {
	id: string; // this is the peer id
	clientID: number; // this is the yjs doc id, possible removable
	name: string;
	points: number;
	lastOnline: number;
	x: number; // between 0 and 1 => normalized
	y: number; // between 0 and 1
};

/**
 * 
 * This class Wraps the YMap 
 * to hide the setter and getter 
 * 
 * Settings on of the attributes, will trigger 
 * y-js and send the changes to all peers
 */
export class Player {
	private _id: string = '';
	private _map;

	static offlineTimeout = 1000;
	static goneTimeout = 10000; //

	constructor(props?) {
		if (props) {
			this._map = new Y.Map<any>();
			this._id = props.id;
			this._map.set('id', props.id);
			this._map.set('clientID', props.clientID);
			this.name = props.name || props.id;
			this.x = props.x || 0.5;
			this.y = props.y || 0.5;
			this.points = props.points || 0;
			this.lastOnline = props.lastOnline;
		}
	}

	/**
	 * static factory function
	 * @param {string} id player peer id
	 * @param {Y.Map} [map] - a Yjs - map
	 */
	static fromYMap(id: string, map): Player {
		const player = new Player();
		player._id = id;
		player._map = map;
		return player;
	}

	toJSON() {
		return this._map.toJSON();
	}

	public get map() {
		return this._map;
	}

	// indicates that the player is online, maybe an glicht or so
	public get online(): boolean {
		return Date.now() - this.lastOnline < Player.offlineTimeout;
	}

	// indicates that the player is not online anymore and gone...
	public get gone(): boolean {
		return Date.now() - this.lastOnline > Player.goneTimeout;
	}

	public set lastOnline(ts: number) {
		this._map.set('lastOnline', ts);
	}

	public get lastOnline(): number {
		return this._map.get('lastOnline');
	}

	public get id(): string {
		return this._id;
	}

	public get clientID(): string {
		return this._map.get('clientID');
	}

	public get name(): string {
		return this._map.get('name') as string;
	}

	public set name(name: string) {
		this._map.set('name', name);
	}

	public get x() {
		return this._map.get('x');
	}
	public set x(value: number) {
		this._map.set('x', value);
	}

	public get y(): number {
		return this._map.get('y') as number;
	}
	public set y(value: number) {
		this._map.set('y', value);
	}

	public get points(): number {
		return this._map.get('points') as number;
	}
	public set points(value: number) {
		this._map.set('points', value);
	}
}
