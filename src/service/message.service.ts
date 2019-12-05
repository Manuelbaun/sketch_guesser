import * as Y from 'yjs';
import { Subject } from 'rxjs';
import Message from '../models/message';

interface MessageServiceInterface {
	messageState: any;
	sendMessage: Function;
	getMessages: Function;
}

export default class MessageService extends Subject<Message[]> implements MessageServiceInterface {
	messageState = new Y.Array<Message>();
	name: string;

	constructor(messageState, name: string) {
		super();
		this.name = name;
		this.messageState = messageState;
		this.messageState.observe((event) => {
			console.log('messageState Update');
		});
	}

	sendMessage(msg: string) {
		// this action already updates the doc and transmits als changes to the peers

		// For some reason, pushing Message class does not work, so just the OBject for now
		this.messageState.push([
			{
				message: msg,
				user: this.name,
				time: new Date()
			}
		]);

		this.next(this.messageState.toArray().reverse());
	}

	getMessages(): Message[] {
		return this.messageState.toArray().reverse();
	}
}
