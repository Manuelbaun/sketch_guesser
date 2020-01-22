import { Subject } from 'rxjs';
import { CacheStoreInterface } from '../../service/storage/cache';
import { Message } from '../../models/message';
import { PersistentStore } from '../../service/storage';

export class MessageManager extends Subject<Message[]> {
	/**
	 * @type YArray<Message>
	 */
	store;
	observer;
	public get localName(): string {
		return PersistentStore.localName;
	}

	public get localID(): string {
		return PersistentStore.clientID.toString();
	}

	constructor(store: CacheStoreInterface) {
		super();
		console.log('MessageManager init');
		this.store = store.messages;
		this.observer = () => {
			this.next(this.store.toArray().reverse());
		};

		this.store.observe(this.observer);
	}

	dispose() {
		console.log('Dispose MessageManager');
		this.clearAllMessages();
		this.store.unobserve(this.observer);
	}

	sendMessage(msg: string) {
		this.store.push([
			{
				id: this.localID,
				message: msg,
				user: this.localName,
				ts: Date.now()
			}
		]);

		const m = this.store.toArray().reverse();

		this.next(m);
	}

	clearAllMessages() {
		this.store.delete(0, this.store.length);
	}

	getMessages(): Message[] {
		return this.store.toArray().reverse();
	}
}
