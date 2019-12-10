import { Subject, Subscription } from 'rxjs';
import { CacheEngineInterface } from '../../gameEngine/cache.engine';
import { Message } from '../../models/message';
import { PlayerEngine } from '../../gameEngine';

/**
 * TODO: Is this just an Manager?
 */

export default class MessageEngine extends Subject<Message[]> {
	/**
	 * @type YArray<Message>
	 */
	messageState;
	sub: Subscription;
	private engine: PlayerEngine;

	public get localName(): string {
		return this.engine.localName;
	}

	public get localID(): string {
		return this.engine.localID;
	}
	constructor(store: CacheEngineInterface, engine: PlayerEngine) {
		super();

		this.messageState = store.messages;
		this.engine = engine;
		this.messageState.observe((event) => {
			this.next(this.messageState.toArray().reverse());
		});

		console.log('MessageEngine init');
	}

	sendMessage(msg: string) {
		this.messageState.push([
			{
				id: this.localID,
				message: msg,
				user: this.localName,
				ts: Date.now()
			}
		]);

		this.next(this.messageState.toArray().reverse());
	}

	getMessages(): Message[] {
		return this.messageState.toArray().reverse();
	}
}
