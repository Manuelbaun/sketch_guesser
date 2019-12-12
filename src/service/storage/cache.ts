import * as Y from 'yjs';
// import { YMap, YArray, Doc } from './yjs.types';

import { Message, DrawingPath } from '../../models';

export interface CacheStoreInterface {
	yDoc;
	drawPaths;
	gameState;
	clock;
	messages;
	players;
}

export class CacheStore implements CacheStoreInterface {
	private _yDoc = new Y.Doc();

	public get yDoc() {
		return this._yDoc;
	}

	private _drawPaths = this.yDoc.getArray<DrawingPath>('drawState');
	public get drawPaths() {
		return this._drawPaths;
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
