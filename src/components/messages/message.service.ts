import { Subject } from 'rxjs';
import { Message } from './message.model';
import { MessageStorePort } from './message.store.port';
import { ServiceInterface } from '../base';
import { PersistentStore } from '../../service';

/**
 * TODO: this will implement more logic later on
 */
export class MessageService implements ServiceInterface<Array<Message>> {
	adapter: MessageStorePort;
	subject: Subject<Array<Message>> = new Subject();
	messages: Array<Message> = new Array<Message>();

	constructor(adapter: MessageStorePort) {
		this.adapter = adapter;
		// triggers, whenever there is a change in the adapter storage
		this.adapter.onUpdate((messages: Message[]): void => {
			this.messages = messages.reverse();
			this.subject.next(this.messages);
		});
	}

	isLocal(id: string): boolean {
		return +id === PersistentStore.clientID;
	}

	sendMessage(msg: string): void {
		this.adapter.add({
			id: PersistentStore.clientID.toString(),
			message: msg,
			user: PersistentStore.localName,
			ts: Date.now()
		});
	}

	dispose(): void {
		console.log('dispose Service');
		this.adapter.clearStore();
	}
}