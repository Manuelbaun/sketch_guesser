import { RandomGenerator } from '../../util/utilitize';
/**
 * Class that stores some data persistent on that Tab session like the id
 * so if the Tab refreshed, the ID stays the same
 * 
 * Quick hack to get the session storage up and going
 */

interface SessionStore {
	name: string;
	id: number;
}

type SessionKeys = keyof SessionStore;

export class PersistentStore {
	private static _clientID: number;
	static chanceName;

	public static get id(): number {
		const key: SessionKeys = 'id';
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
		const key: SessionKeys = 'name';
		if (!(this._localName = sessionStorage.getItem(key) || '')) {
			this._localName = RandomGenerator.avatarName();
			sessionStorage.setItem(key, this._localName);
		}
		return this._localName;
	}

	public static set localName(value: string) {
		this._localName = value;
		const key: SessionKeys = 'name';
		sessionStorage.setItem(key, this._localName);
	}

	public static dispose(): void {
		sessionStorage.clear();
	}
}
