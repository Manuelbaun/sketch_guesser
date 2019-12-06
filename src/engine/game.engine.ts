import * as Y from 'yjs';
import sha256 from 'sha256';
import { EngineInterface, DocUpdate, DocUpdateTypes } from '../interfaces/engine.interface';
import { EventEmitter } from 'events';

export enum GameEngineEvents {
	CLOCK = 'CLOCK',
	NEXT_ROUND = 'NEXT_ROUND',
	MASTER_CHANGED = 'MASTER_CHANGED',
	CHOOSE_WORD = 'CHOOSE_WORD',
	GAME_STARTED = 'GAME_STARTED',
	GAME_FINISHED = 'GAME_FINISHED'
}

export type GameState = {
	gameID: string;
	currentMasterID: string;
	rounds: number;
	currentRound: number;
	codeWordHash: string;
};

export default class GameEngine implements EngineInterface {
	private yDoc = new Y.Doc();
	private gameState = this.yDoc.getMap('gameState');
	private clock = this.yDoc.getMap('clock');
	private emitter: EventEmitter = new EventEmitter();

	constructor() {
		this.yDoc.on('update', (update) => {
			const docUpdate: DocUpdate = {
				type: DocUpdateTypes.GAME,
				payload: update
			};
			this.onUpdate(docUpdate);
		});
		// this.gameState.observe((event) => {
		// 	for (const entry of this.gameState.entries()) {
		// 		console.log('GameState Change', entry);
		// 	}
		// });
		this.clock.observe((event) => {
			this.emitter.emit(GameEngineEvents.CLOCK, this.currentTime);
		});

		console.log('GameEngine init');
	}

	// Functional the handle the doc
	applyUpdate(update: DocUpdate) {
		Y.applyUpdate(this.yDoc, new Uint8Array(update.payload));
	}

	onUpdate = (update: DocUpdate): void => {
		throw new Error('Please wire the onEmitGameUpdates up');
	};

	// emitter wrapper
	on(type: GameEngineEvents, listener: (...args: any[]) => void) {
		this.emitter.on(type, listener);
	}

	// emitter wrapper
	off(type: GameEngineEvents, listener: (...args: any[]) => void) {
		this.emitter.off(type, listener);
	}

	// Mechanics
	get currentTime(): number {
		return this.clock.get('time');
	}

	get currentRound(): number {
		return this.gameState.get('currentRound');
	}

	get codeWordHash(): number {
		return this.gameState.get('codeWordHash');
	}

	get currentMasterID(): number {
		return this.gameState.get('currentMasterID');
	}

	setGameProps(game: GameState) {
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

	get randomWords(): string[] {
		return [ 'Haus', 'Katze', 'Maus' ];
	}

	set guessWord(word: string) {
		if (!this.gameState) return;

		this.yDoc.transact(() => {
			this.gameState.set('codeWordHash', sha256(word));
		});
	}

	roundStarted = false;
	startRound() {
		if (this.gameState.get('currentRound') >= this.gameState.get('rounds')) return;

		if (this.roundStarted) return;
		this.roundStarted = true;
		this.clock.set('time', 60);

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
