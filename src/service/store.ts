import * as Y from 'yjs';
import Message from '../models/message';
import Player from '../models/player';

export default class Store {
	private _doc = new Y.Doc();

	public get doc() {
		return this._doc;
	}

	private _drawState = this._doc.getArray('drawing');
	public get drawState() {
		return this._drawState;
	}

	private _messageState = this._doc.getArray<Message>('messages');
	public get messageState() {
		return this._messageState;
	}

	private _gameState = this._doc.getMap('gameState');
	public get gameState() {
		return this._gameState;
	}

	private _clock = this._doc.getMap('clock');
	public get clock() {
		return this._clock;
	}

	private _player = this._doc.getArray<Player>('players');
	public get player() {
		return this._player;
	}

	onDataSend = (data: string | Uint8Array) => {
		console.log('send data store');
	};

	constructor() {
		this._doc.on('update', (update, agr1) => {
			console.log('DocumentUpdate');
			this.onDataSend(update);
		});

		this.drawState.observeDeep((event, arg1) => {
			console.log('drawState');
		});

		this.messageState.observe((event, arg1) => {
			console.log('messageState Update');
		});
		this.clock.observe((event, arg1) => {
			console.log('ClockUpdate Update');
		});

		this.gameState.observe((event, arg1) => {
			console.log('gameState Update');
		});
	}

	onIncomingUpdate(update) {
		const uintArray = new Uint8Array(update);
		console.log('apply data', uintArray.length);
		Y.applyUpdate(this._doc, uintArray);
	}

	getCompleteState = () => Y.encodeStateAsUpdate(this._doc);
}
