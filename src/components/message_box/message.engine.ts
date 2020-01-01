import { Subject, Subscription } from 'rxjs';
import { CacheStoreInterface } from '../../service/storage/cache';
import { Message } from '../../models/message';
import { PersistentStore } from '../../service/storage';

/**
 * TODO: Is this just an Manager?
 */

export class MessageEngine extends Subject<Message[]> {
	/**
	 * @type YArray<Message>
	 */
	messageStore;
	sub: Subscription;

	public get localName(): string {
		return PersistentStore.localName;
	}

	public get localID(): string {
		return PersistentStore.localID;
	}
	constructor(store: CacheStoreInterface) {
		super();

		this.messageStore = store.messages;
		this.messageStore.observe((event) => {
			this.next(this.messageStore.toArray().reverse());
		});

		console.log('MessageEngine init');
	}

	sendMessage(msg: string) {
		this.messageStore.push([
			{
				id: this.localID,
				message: msg,
				user: this.localName,
				ts: Date.now()
			}
		]);

		this.next(this.messageStore.toArray().reverse());
	}

	getMessages(): Message[] {
		return this.messageStore.toArray().reverse();
	}
}
