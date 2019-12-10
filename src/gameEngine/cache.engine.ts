import * as Y from 'yjs';
// import { YMap, YArray, Doc } from './yjs.types';
import { Subscription } from 'rxjs';
import { Message, DrawingPath } from '../models';

import {
	CommunicationServiceInterface,
	Data,
	DataTypes,
	ConnectionEventType
} from '../service/communication/communication.types';

export interface CacheEngineInterface {
	yDoc;
	drawPathStore;
	gameState;
	clock;
	messages;
	players;
}

export class CacheEngine implements CacheEngineInterface {
	private _yDoc = new Y.Doc();
	public get yDoc() {
		return this._yDoc;
	}

	private _drawPathStore = this.yDoc.getArray<DrawingPath>('drawState');
	public get drawPathStore() {
		return this._drawPathStore;
	}

	private _gameState = this.yDoc.getMap('gameState');
	public get gameState() {
		return this._gameState;
	}

	private _clock = this.yDoc.getMap('clock');
	public get clock() {
		return this._clock;
	}

	private _messages = this.yDoc.getArray<Message>('messages');
	public get messages() {
		return this._messages;
	}

	private _players = this.yDoc.getMap('players');
	public get players() {
		return this._players;
	}

	private subDataStream: Subscription;
	private subCommStream: Subscription;

	constructor(comm: CommunicationServiceInterface) {
		this.yDoc.on('update', (update) => {
			const data: Data = {
				type: DataTypes.MESSAGE,
				payload: update
			};
			// comm.sendDataAll(data);
		});

		// subscribe to game data with filter
		const _filter = (data: Data) => data.type === DataTypes.GAME;
		this.subDataStream = comm.dataStream.subscribe({
			next: (data) => Y.applyUpdate(this.yDoc, data.payload)
		});

		// send all the new peer
		this.subCommStream = comm.connectionStream.subscribe({
			next: (data) => {
				console.log(data);
				if (data.type === ConnectionEventType.OPEN) {
					const state = Y.encodeStateAsUpdate(this.yDoc);
					const _data: Data = {
						type: DataTypes.DOC_STATE,
						payload: state
					};
					comm.sendDataToID(data.peerID, _data);
				}
			}
		});
	}

	// TODO: compute difference to update new connected peer

	destroy() {
		this.subCommStream.unsubscribe();
		this.subDataStream.unsubscribe();
	}
}
