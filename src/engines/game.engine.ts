import sha256 from 'sha256';
import { EventEmitter } from 'events';
import { CacheStoreInterface } from '../service/storage/cache';
import { Game, GameStates, GameEvents } from '../models';
import EngineInterface from './engine.interface';

export interface GameEngineInterface extends EngineInterface {
	// emitter wrapper
	emit(type: GameEvents, ...args: any[]);
	handleGameStateChanged(key: string);
	nextRound();
	// emitter wrapper
	off(type: GameEvents, listener: (...args: any[]) => void);
	// emitter wrapper
	on(type: GameEvents, listener: (...args: any[]) => void);
	resetTime();
	setupGame(game: Game);
	startGame();
	stopGame();

	// getters and setters
	codeWordHash: number;
	currentMasterID: number;
	currentRound: number;
	guessWord: string;
	name: string;
	randomWords: string[];
	rounds: number;
	state: GameStates;
	time: number;
}

export class GameEngine implements GameEngineInterface {
	private _emitter: EventEmitter = new EventEmitter();
	private _observerClock;
	private _observerGameState;
	private _timer: NodeJS.Timeout;

	/**
	 * @type {YMap<GameState>}
	 */
	private _gameState;
	/**
	 * @type {YMap<any>}
	 */
	private _clock;
	/**
	 * Function to execute multiple transaction on document
	 * @type {Function(() => {})} 
	 */
	private _transact;
	constructor(store: CacheStoreInterface) {
		this._gameState = store.gameState;
		this._clock = store.clock;
		this._transact = store.gameState.doc.transact;

		this._observerClock = (event) => {
			this.emit(GameEvents.CLOCK_UPDATE, this.time);
		};

		this._observerGameState = (event) => {
			event.keysChanged.forEach((key) => {
				this.handleGameStateChanged(key as string);
			});
		};

		this._clock.observe(this._observerClock);
		this._gameState.observe(this._observerGameState);
		console.log('GameEngine init');
	}

	dispose() {
		this._clock.unobserve(this._observerClock);
		this._gameState.unobserve(this._observerGameState);
		console.log('GameEngine dispose');
	}

	handleGameStateChanged(key: string) {
		const value = this._gameState.get(key);

		if (key === 'currentRound') {
			this.emit(GameEvents.ROUND_CHANGE, value);
		}

		if (key === 'state') {
			switch (value) {
				case GameStates.WAITING:
					this.emit(GameEvents.GAME_PAUSED, true);
					break;
				case GameStates.CHOOSING_WORD:
					this.emit(GameEvents.CHOOSING_WORD, true);
					break;
				case GameStates.STARTED:
					this.emit(GameEvents.GAME_STARTED, true);
					break;
				case GameStates.STOPPED:
					this.emit(GameEvents.GAME_STOPPED, true);
					break;
			}
		}
	}

	// emitter wrapper
	emit(type: GameEvents, ...args: any[]) {
		this._emitter.emit(type, args);
	}

	// emitter wrapper
	on(type: GameEvents, listener: (...args: any[]) => void) {
		this._emitter.on(type, listener);
	}

	// emitter wrapper
	off(type: GameEvents, listener: (...args: any[]) => void) {
		this._emitter.off(type, listener);
	}

	setupGame(game: Game) {
		clearInterval(this._timer);

		this._transact(() => {
			for (const key in game) {
				console.log(key, game[key]);
				this._gameState.set(key, game[key]);
			}
			this.resetTime();
		});
	}

	resetTime() {
		this.time = 60;
	}

	startGame() {
		const state = this.state;
		if (state === GameStates.STARTED || state === GameStates.CHOOSING_WORD) return;

		this._transact(() => {
			this.resetTime();
			this._gameState.set('state', GameStates.STARTED);
		});

		// setup the game time
		this._timer = setInterval(() => {
			const time = this.time - 1;
			this.time = time;

			if (time < 1) {
				if (this.currentRound <= this.rounds) this.nextRound();
				else this.stopGame();
			}
		}, 1000);
	}

	stopGame() {
		clearInterval(this._timer);
		this._gameState.set('state', GameStates.STOPPED);
	}

	nextRound() {
		const round = this.currentRound + 1;
		this._gameState.doc.transact(() => {
			this._gameState.set('currentRound', round);
			this.resetTime();
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
	// Mechanics
	get time(): number {
		return this._clock.get('time');
	}

	set time(value: number) {
		this._clock.set('time', value);
	}

	get currentRound(): number {
		return this._gameState.get('currentRound');
	}

	get rounds(): number {
		return this._gameState.get('rounds');
	}

	get codeWordHash(): number {
		return this._gameState.get('codeWordHash');
	}

	get currentMasterID(): number {
		return this._gameState.get('currentMasterID');
	}

	set guessWord(word: string) {
		if (!this._gameState) return;

		this._transact(() => {
			this._gameState.set('codeWordHash', sha256(word));
		});
	}

	get state() {
		return this._gameState.get('state') as GameStates;
	}

	set state(value: GameStates) {
		this._gameState.set('state', value);
	}
}
