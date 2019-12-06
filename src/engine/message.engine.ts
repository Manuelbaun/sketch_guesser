import * as Y from 'yjs';
import { Subject } from 'rxjs';
import Message from '../models/message';

export default class MessageEngine extends Subject<Message[]> {
	yDoc = new Y.Doc();

	messageState = this.yDoc.getArray<Message>('messages');
	name: string;

	constructor(userName: string) {
		super();
		this.yDoc.on('update', (update) => {
			this.onUpdate(update);
		});
		this.name = userName;

		this.messageState.observe((event) => {
			console.log('messageState Update');
			this.next(this.messageState.toArray().reverse());
		});

		console.log('MessageEngine init');
	}

	applyUpdate(update) {
		Y.applyUpdate(this.yDoc, update);
	}

	onUpdate = (update: Uint8Array): void => {
		throw new Error('Please wire the onEmitGameUpdates up');
	};

	sendMessage(msg: string) {
		// this action already updates the doc and transmits als changes to the peers

		// For some reason, pushing Message class does not work, so just the OBject for now
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
