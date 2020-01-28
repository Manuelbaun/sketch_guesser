/**
 * This is the Interface, which will be used to update certain props.
 * Props are optional
 */
export interface PlayerProps {
	name?: string;
	points?: number;
	lastOnline?: number;
}

/**
 * This is the Model, which has all Props!!
 */
export interface PlayerModel extends PlayerProps {
	// this is the yjs doc id, possible removable
	id: number;
	name: string;
	points: number;
	lastOnline: number;
}

/**
 * I dont know, if we should do it like this, 
 * We need a class to check against online time...
 * we cant put it into the PlayerModel Interface, since
 * we dont want this Logic in the UI to happen
 */
export class Player implements PlayerModel {
	/**
	 * time, when in the player lost connection, and
	 * is probably not gone
	 */
	static timeOutOffline = 1000;
	/**
	 * the time, when the player is definitely left the game 
	 */
	static timeOutTotal = 10000;

	id: number;
	name: string;
	points: number;
	lastOnline: number;
	constructor(props: PlayerModel) {
		this.id = props.id;
		this.name = props.name;
		this.points = props.points;
		this.lastOnline = props.lastOnline;
	}

	// indicates that the player is online, maybe an glitch or so
	public online(): boolean {
		return Date.now() - this.lastOnline < Player.timeOutOffline;
	}

	// indicates that the player is not online anymore and gone...
	public gone(): boolean {
		return Date.now() - this.lastOnline > Player.timeOutTotal;
	}
}
