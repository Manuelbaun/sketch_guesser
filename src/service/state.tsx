import * as Y from 'yjs';

export default class State {
	private doc = new Y.Doc();

	drawState = this.doc.getArray('drawing');
	messageState = this.doc.getArray('messages');

	constructor() {
		this.doc.on('update', (update, agr1) => {
			console.log('DocumentUpdate', update, agr1);
			// this.onEmitUpdate && this.onEmitUpdate(update);
		});

		this.drawState.observe((event, arg1) => {
			console.log('draw Update', event, arg1);
		});

		this.messageState.observe((event, arg1) => {
			console.log('message Update', event, arg1);
		});
	}

	onIncomingUpdate(update) {
		const uintArray = new Uint8Array(update);
		Y.applyUpdate(this.doc, uintArray);
	}

	getCompleteState = () => Y.encodeStateAsUpdate(this.doc);
}
