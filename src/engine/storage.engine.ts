import * as Y from 'yjs';
import { Subscription } from 'rxjs';
import { DrawPath } from '../components/drawing/types';
import Message from '../models/message';
import { CommunicationServiceInterface, Data, DataTypes } from '../service/communication/communication.type';

export default class StorageEngine {
	yDoc = new Y.Doc();
	private drawPathStore = this.yDoc.getArray<DrawPath>('drawState');
	private gameState = this.yDoc.getMap('gameState');
	private clock = this.yDoc.getMap('clock');
	private _messages = this.yDoc.getArray<Message>('messages');
	public get messages() {
		return this._messages;
	}
	sub: Subscription;

	constructor(comm: CommunicationServiceInterface) {
		this.yDoc.on('update', (update) => {
			const data: Data = {
				type: DataTypes.MESSAGE,
				payload: update
			};
			comm.sendDataAll(data);
		});

		// subscribe to game data with filter
		// const _filter = (data: Data) => data.type === DataTypes.GAME;
		this.sub = comm.dataStream.subscribe({
			next: (data) => Y.applyUpdate(this.yDoc, data.payload)
		});
	}
}
