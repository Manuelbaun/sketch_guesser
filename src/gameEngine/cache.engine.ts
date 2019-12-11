import * as Y from 'yjs';
// import { YMap, YArray, Doc } from './yjs.types';

import { Message, DrawingPath } from '../models';

export interface CacheEngineInterface {
	yDoc;
	drawPathStore;
	gameState;
	clock;
	messages;
	players;
}

export class CacheEngine implements CacheEngineInterface {
	constructor() {}
	private _yDoc = new Y.Doc();
	public get yDoc() {
		return this._yDoc;
	}

	private _drawPathStore = this.yDoc.getArray<DrawingPath>('drawState');
	public get drawPathStore() {
		return this._drawPathStore;
	}

	private _messages = this.yDoc.getArray<Message>('messages');
	public get messages() {
		return this._messages;
	}

	private _gameState = this.yDoc.getMap('gameState');
	public get gameState() {
		return this._gameState;
	}

	private _clock = this.yDoc.getMap('clock');
	public get clock() {
		return this._clock;
	}

	private _players = this.yDoc.getMap('players');
	public get players() {
		return this._players;
	}
}
