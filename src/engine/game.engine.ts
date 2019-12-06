import * as Y from 'yjs';
import sha256 from 'sha256';

export default class GameEngine {
	yDoc = new Y.Doc();
	gameState = this.yDoc.getMap('gameState');
	clock = this.yDoc.getMap('clock');

	constructor() {
		this.yDoc.on('update', (update) => {
			this.onUpdate(update);
		});
		// this.gameState.observe((event) => {
		// 	for (const entry of this.gameState.entries()) {
		// 		console.log('GameState Change', entry);
		// 	}
		// });
		// this.clock.observe((event) => {
		// 	for (const entry of this.clock.entries()) {
		// 		console.log('Clock Change', entry[1]);
		// 	}
		// });
		console.log('GameEngine init');
	}

	applyUpdate(update) {
		Y.applyUpdate(this.yDoc, update);
	}

	onUpdate = (update: Uint8Array): void => {
		throw new Error('Please wire the onEmitGameUpdates up');
	};

	setGameProps(game) {
		this.clock.set('time', 60);
		this.yDoc.transact(() => {
			for (const key in game) {
				this.gameState.set(key, game[key]);
			}
		});
	}

	private _name: string;
	set name(name: string) {
		this._name = name;
	}

	get name(): string {
		return this._name;
	}

	setGuessWord(word: string): boolean {
		if (!this.gameState) return false;

		this.yDoc.transact(() => {
			this.gameState.set('codeWordHash', sha256(word));
			this.gameState.set('codeWord', word);
		});

		return true;
	}

	get3RandomWords(): string[] {
		return [ 'Haus', 'Katze', 'Maus' ];
	}

	roundStarted = false;
	startRound() {
		if (this.gameState.get('currentRound') >= this.gameState.get('rounds')) return;

		if (this.roundStarted) return;
		this.roundStarted = true;
		this.clock.set('time', 2);
		const timer = setInterval(() => {
			const clock = this.clock.get('time');
			this.clock.set('time', clock - 1);

			if (clock <= 1) {
				clearInterval(timer);
				this.roundStarted = false;
			}
		}, 1000);
	}
}
