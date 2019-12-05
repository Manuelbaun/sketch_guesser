import * as Y from 'yjs';
import sha256 from 'sha256';
import GameInterface from './game.interface';
import Store from './store';

interface GameEngineStoreInterface {
	gameState;
	clock;
}
export default class GameEngine {
	gameState = new Y.Map<any>();
	clock;
	/**
     * @param {Y.Doc}
     */
	doc;

	/**
     * 
     * @param {Y.Map} gameState 
     */
	constructor(store: GameEngineStoreInterface) {
		this.gameState = store.gameState;
		this.clock = store.clock;
		this.clock.set('time', 60);
	}

	createGame(game: GameInterface) {
		if (this.doc)
			this.doc.transact(() => {
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
		if (!this.gameState.doc) return false;

		this.gameState.doc.transact(() => {
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
		const timer = setInterval(() => {
			const clock = this.clock.get('time');
			this.clock.set('time', clock - 1);

			if (clock <= 0) {
				clearInterval(timer);
				this.roundStarted = false;
			}
		}, 1000);
	}
}
