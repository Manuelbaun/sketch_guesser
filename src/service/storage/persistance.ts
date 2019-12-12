import * as random from 'lib0/dist/random.js';

/**
 * Class that stores some data persistent on that Tab session like the id
 * so if the Tab refreshed, the ID stays the same
 */

export class PersistentStore {
	private _playerID: string;
	public get playerID(): string {
		return this._playerID;
	}

	constructor() {
		// loads the id from the sessionStorage
		// when no ID exist, create on
		if (!(this._playerID = sessionStorage.getItem('player_id') || '')) {
			this._playerID = random.uuidv4();
			sessionStorage.setItem('player_id', this.playerID);
		}
	}
}
