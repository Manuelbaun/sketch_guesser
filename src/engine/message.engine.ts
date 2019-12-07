import * as Y from 'yjs';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import Message from '../models/message';

import { Data, DataTypes, CommunicationServiceInterface } from '../service/communication/communication.type';
import StorageEngine from './storage.engine';

export default class MessageEngine extends Subject<Message[]> {
	yDoc = new Y.Doc();
	messageState = this.yDoc.getArray<Message>('messages');
	name: string;
	sub: Subscription;

	constructor(userName: string, comm: CommunicationServiceInterface, store: StorageEngine) {
		super();

		this.yDoc.on('update', (update) => {
			const data: Data = {
				type: DataTypes.MESSAGE,
				payload: update
			};
			comm.sendDataAll(data);
		});

		this.name = userName;

		this.messageState.observe((event) => {
			console.log('messageState Update');
			this.next(this.messageState.toArray().reverse());
		});

		// subscribe to game data with filter
		const _filter = (data: Data) => data.type === DataTypes.GAME;
		this.sub = comm.dataStream.pipe(filter(_filter)).subscribe({
			next: (data) => Y.applyUpdate(this.yDoc, data.payload)
		});

		console.log('MessageEngine init');
	}

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
