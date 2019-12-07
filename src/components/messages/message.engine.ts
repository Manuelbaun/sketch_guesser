import { Subject, Subscription } from 'rxjs';
import Message from '../../models/message';
import { CacheEngineInterface } from '../../engine/cache.engine';

export default class MessageEngine extends Subject<Message[]> {
	/**
	 * @type YArray<Message>
	 */
	messageState;
	name: string;
	sub: Subscription;

	constructor(userName: string, store: CacheEngineInterface) {
		super();

		this.name = userName;
		this.messageState = store.messages;

		this.messageState.observe((event) => {
			this.next(this.messageState.toArray().reverse());
		});

		console.log('MessageEngine init');
	}

	sendMessage(msg: string) {
		this.messageState.push([
			{
				message: msg,
				user: this.name,
				ts: Date.now()
			}
		]);

		this.next(this.messageState.toArray().reverse());
	}

	getMessages(): Message[] {
		return this.messageState.toArray().reverse();
	}
}
