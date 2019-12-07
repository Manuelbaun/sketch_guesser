import * as Y from 'yjs';
import sha256 from 'sha256';
import { EventEmitter } from 'events';
import { CacheEngineInterface } from './cache.engine';
import { GameEngineEvents, GameState, GameStates } from './game.types';

export default class GameEngine {
	private gameState; //  YMap<GameState>
	private clock;
	private emitter: EventEmitter = new EventEmitter();

	constructor(store: CacheEngineInterface) {
		this.gameState = store.gameState;
		this.clock = store.clock;

		this.clock.observe((event) => {
			this.emitter.emit(GameEngineEvents.CLOCK_UPDATE, this.currentTime);
		});

		this.gameState.observe((event) => {
			event.keysChanged.forEach((key) => {
				this.handleGameStateChanged(key as string);
			});
		});

		console.log('GameEngine init');
	}

	handleGameStateChanged(key: string) {
		const value = this.gameState.get(key);
		console.log(key, this.gameState.get(key));

		if (key === 'currentRound') {
			this.emitter.emit(GameEngineEvents.ROUND_CHANGE, value);
		}

		if (key === 'state') {
			switch (value) {
				case GameStates.WAITING:
					this.emitter.emit(GameEngineEvents.GAME_PAUSED, true);
					break;
				case GameStates.CHOOSING_WORD:
					this.emitter.emit(GameEngineEvents.CHOOSING_WORD, true);
					break;
				case GameStates.STARTED:
					this.emitter.emit(GameEngineEvents.GAME_STARTED, true);
					break;
				case GameStates.STOPPED:
					this.emitter.emit(GameEngineEvents.GAME_STOPPED, true);
					break;
			}
		}
	}

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
	get rounds(): number {
		return this.gameState.get('rounds');
	}

	get codeWordHash(): number {
		return this.gameState.get('codeWordHash');
	}

	get currentMasterID(): number {
		return this.gameState.get('currentMasterID');
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

		this.gameState.doc.transact(() => {
			this.gameState.set('codeWordHash', sha256(word));
		});
	}

	private roundStarted = false;
	private gameStarted = false;

	// normally should be private!!
	get state() {
		return this.gameState.get('state') as GameStates;
	}

	setupGame(game: GameState) {
		// TODO: check whether this has to change
		this.gameState.doc.transact(() => {
			for (const key in game) {
				console.log(key, game[key]);
				this.gameState.set(key, game[key]);
			}
			this.clock.set('time', 60);
		});
	}

	startGame() {
		const state = this.state;
		if (state === GameStates.STARTED || state === GameStates.CHOOSING_WORD) return;

		this.gameState.doc.transact(() => {
			this.clock.set('time', 60);
			this.gameState.set('state', GameStates.STARTED);
		});

		// setup the game time
		this.timer = setInterval(() => {
			const clock = this.clock.get('time');
			this.clock.set('time', clock - 1);

			if (clock <= 1) {
				clearInterval(this.timer);
			}
		}, 1000);
	}

	timer: NodeJS.Timeout;

	stopGame() {
		clearInterval(this.timer);
		this.gameState.set('state', GameStates.STOPPED);
	}

	nextRound() {
		const round = this.currentRound + 1;
		this.gameState.set('currentRound', round);
	}
}
