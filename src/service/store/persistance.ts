import { RandomGenerator } from '../random_generator';
/**
 * Class that stores some data persistent on that Tab session like the id
 * so if the Tab refreshed, the ID stays the same
 * 
 * Quick hack to get the session storage up and going
 */

enum SessionKeys {
	NAME = 'name',
	PEER_ID = 'peer_id',
	CLIENT_ID = 'client_id'
}

export class PersistentStore {
	private static _localID: string;
	private static _clientID: number;
	static chanceName;

	// loads the id from the sessionStorage
	// when no ID exist, create on
	public static get localID(): string {
		const key: SessionKeys = SessionKeys.PEER_ID;
		if (!(this._localID = sessionStorage.getItem(key) || '')) {
			this._localID = RandomGenerator.uuidv4();
			sessionStorage.setItem(key, this._localID);
		}

		return this._localID;
	}

	public static get clientID(): number {
		const key: SessionKeys = SessionKeys.CLIENT_ID;
		let clientID = '';
		if (!(clientID = sessionStorage.getItem(key) || '')) {
			this._clientID = RandomGenerator.uint32();
			sessionStorage.setItem(key, this._clientID.toString());
		} else {
			this._clientID = parseInt(clientID);
		}

		return this._clientID;
	}
	/**
	 * Stores the user Local name. If there is no user name defined, 
	 * generate a random one else use the local name 
	 * */
	private static _localName: string;
	public static get localName(): string {
		const key: SessionKeys = SessionKeys.NAME;
		if (!(this._localName = sessionStorage.getItem(key) || '')) {
			this._localName = RandomGenerator.avatarName();
			sessionStorage.setItem(key, this._localName);
		}
		return this._localName;
	}

	public static set localName(value: string) {
		this._localName = value;
		const key: SessionKeys = SessionKeys.NAME;
		sessionStorage.setItem(key, this._localName);
	}

	public static dispose() {
		sessionStorage.clear();
	}
}
