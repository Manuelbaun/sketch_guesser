import * as Y from 'yjs';
import Message from '../models/message';

export default class Store {
	private _doc = new Y.Doc();
	get doc() {
		return this._doc;
	}

	drawState = this._doc.getArray('drawing');
	messageState = this._doc.getArray<Message>('messages');
	gameState = this._doc.getMap('gameState');
	clock = this._doc.getMap('clock');

	constructor() {
		this._doc.on('update', (update, agr1) => {
			console.log('DocumentUpdate');
			// this.onEmitUpdate && this.onEmitUpdate(update);
		});

		this.drawState.observe((event, arg1) => {
			console.log('drawState');
		});

		// this.messageState.observe((event, arg1) => {
		// 	console.log('messageState Update');
		// });
		this.clock.observe((event, arg1) => {
			console.log('ClockUpdate Update');
		});
		// this.gameState.observe((event, arg1) => {
		// 	console.log('gameState Update');
		// });
	}

	onIncomingUpdate(update) {
		const uintArray = new Uint8Array(update);
		Y.applyUpdate(this._doc, uintArray);
	}

	getCompleteState = () => Y.encodeStateAsUpdate(this._doc);
}
