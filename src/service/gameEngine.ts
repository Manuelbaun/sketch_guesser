import * as Y from 'yjs';
import sha256 from 'sha256';
import GameInterface from './game.interface';

export default class GameEngine {
	gameState = new Y.Map<any>();
	/**
     * @param {Y.Doc}
     */
	doc;
	/**
     * 
     * @param {Y.Map} gameState 
     */
	constructor(gameState) {
		this.gameState = gameState;
		this.doc = this.gameState.doc;
	}

	createGame(game: GameInterface) {
		if (!this.gameState) return;
		if (this.doc)
			this.doc.transact(() => {
				for (const key in game) {
					this.gameState.set(key, game[key]);
				}
			});
	}

	setWord(word: string): boolean {
		if (!this.gameState.doc) return false;

		this.gameState.doc.transact(() => {
			this.gameState.set('codeWordHash', sha256(word));
			this.gameState.set('codeWord', word);
		});

		return true;
	}
}
