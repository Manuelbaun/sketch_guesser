import * as Y from 'yjs';
import { MessageInterface } from '../components/models/message';
import GameInterface from './game.interface';

export default class State {
	private doc = new Y.Doc();

	drawState = this.doc.getArray('drawing');
	messageState = this.doc.getArray<MessageInterface>('messages');
	gameState = this.doc.getMap('game');

	constructor() {
		this.doc.on('update', (update, agr1) => {
			console.log('DocumentUpdate');
			// this.onEmitUpdate && this.onEmitUpdate(update);
		});

		this.drawState.observe((event, arg1) => {
			console.log('drawState');
		});

		// this.messageState.observe((event, arg1) => {
		// 	console.log('messageState Update');
		// });

		this.gameState.observe((event, arg1) => {
			console.log('gameState Update');
		});
	}

	setGame(game: GameInterface) {
		this.doc.transact(() => {
			for (const key in game) {
				this.gameState.set(key, game[key]);
			}
		});
	}

	onIncomingUpdate(update) {
		const uintArray = new Uint8Array(update);
		Y.applyUpdate(this.doc, uintArray);
	}

	getCompleteState = () => Y.encodeStateAsUpdate(this.doc);
}
