import * as Y from 'yjs';
import { Subject } from 'rxjs';
import Message from '../models/message';
import { EngineInterface } from '../interfaces/engine.interface';
import { Data, DataTypes } from '../service/communication/communication.type';

export default class MessageEngine extends Subject<Message[]> implements EngineInterface {
	yDoc = new Y.Doc();
	messageState = this.yDoc.getArray<Message>('messages');
	name: string;

	constructor(userName: string) {
		super();

		this.yDoc.on('update', (update) => {
			const docUpdate: Data = {
				type: DataTypes.MESSAGE,
				payload: update
			};
			this.onUpdate(docUpdate);
		});

		this.name = userName;

		this.messageState.observe((event) => {
			console.log('messageState Update');
			this.next(this.messageState.toArray().reverse());
		});

		console.log('MessageEngine init');
	}

	applyUpdate(update: Uint8Array) {
		Y.applyUpdate(this.yDoc, update);
	}

	onUpdate = (update: Data): void => {
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
