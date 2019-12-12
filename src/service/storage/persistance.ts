import * as random from 'lib0/dist/random.js';

export class PersistentStore {
	playerID: string;
	constructor() {
		if (!(this.playerID = sessionStorage.getItem('player_id') || '')) {
			this.playerID = random.uuidv4();
			sessionStorage.setItem('player_id', this.playerID);
		}
	}
}
