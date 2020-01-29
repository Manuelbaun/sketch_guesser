import * as Y from 'yjs';
import { MessageStorePort } from './message.store.port';
import { CacheStoreSyncInterface } from '../../service';
import { Message, MESSAGES_STORE_NAME } from './message.model';

export class MessageStoreAdapter implements MessageStorePort {
	private _store = new Y.Array<Message>();

	constructor(store: CacheStoreSyncInterface) {
		this._store = store.yDoc.getArray(MESSAGES_STORE_NAME);
		this._store.observe(this._observer);
	}

	/**
	 * This observer gets notified, when the store changes
	 * either, player gets added, updated, or removed
	 * on the key -value level, not the actual player props
	 */
	_observer = (event, tran): void => {
		this._onUpdateListener(this._store.toArray());
	};

	getCurrentContent() {
		return this._store.toArray();
	}

	dispose(): void {
		this._store.unobserve(this._observer);
	}

	clearStore(): void {
		this._store.delete(0, this._store.length);
	}

	add(msg: Message): void {
		this._store.push([ msg ]);
	}

	_onUpdateListener = (messages: Array<Message>): void => {
		throw new Error('Please override me!!');
	};

	onUpdate(handler: (messages: Array<Message>) => void): void {
		this._onUpdateListener = handler;
	}
}
