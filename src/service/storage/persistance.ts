import * as random from 'lib0/dist/random.js';
import Chance from 'chance';
/**
 * Class that stores some data persistent on that Tab session like the id
 * so if the Tab refreshed, the ID stays the same
 * 
 * Quick hack to get the session storage up and going
 */
type SessionKeys = 'local_id' | 'local_name';

export class PersistentStore {
	private static _localID: string;
	static chanceName;

	// loads the id from the sessionStorage
	// when no ID exist, create on
	public static get localID(): string {
		const key: SessionKeys = 'local_id';
		if (!(this._localID = sessionStorage.getItem(key) || '')) {
			this._localID = random.uuidv4();
			sessionStorage.setItem(key, this._localID);
		}

		return this._localID;
	}

	/**
	 * Stores the user Local name
	 * 
	 * if there is no user name defined, generate a random one
	 * else use the local name 
	 * */

	private static _localName: string;
	public static get localName(): string {
		const key: SessionKeys = 'local_name';
		if (!(this._localName = sessionStorage.getItem(key) || '')) {
			this._localName = Chance(this._localID).name();
			sessionStorage.setItem(key, this._localName);
		}
		return this._localName;
	}

	public static set localName(value: string) {
		this._localName = value;
		const key: SessionKeys = 'local_name';
		sessionStorage.setItem(key, this._localName);
	}
}
