import sha256 from 'sha256';
import { EventEmitter } from 'events';
import { CacheEngineInterface } from './cache.engine';
import { GameEngineEvents, GameState, GameStates } from './game.types';

class GameEngineDocSetterGetter {
	gameState; //  YMap<GameState>
	clock;

	constructor(store: CacheEngineInterface) {
		this.gameState = store.gameState;
		this.clock = store.clock;
		this.transact = store.gameState.doc.transact;
	}

	transact;
	// Mechanics
	get time(): number {
		return this.clock.get('time');
	}
	set time(value: number) {
		this.clock.set('time', value);
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

	set guessWord(word: string) {
		if (!this.gameState) return;

		this.gameState.doc.transact(() => {
			this.gameState.set('codeWordHash', sha256(word));
		});
	}

	// normally should be private!!
	get state() {
		return this.gameState.get('state') as GameStates;
	}

	set state(value: GameStates) {
		this.gameState.set('state', GameStates.STARTED);
	}
}

export default class GameEngine extends GameEngineDocSetterGetter {
	private emitter: EventEmitter = new EventEmitter();
	timer: NodeJS.Timeout;

	constructor(store: CacheEngineInterface) {
		super(store);

		this.clock.observe((event) => {
			this.emit(GameEngineEvents.CLOCK_UPDATE, this.time);
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
			this.emit(GameEngineEvents.ROUND_CHANGE, value);
		}

		if (key === 'state') {
			switch (value) {
				case GameStates.WAITING:
					this.emit(GameEngineEvents.GAME_PAUSED, true);
					break;
				case GameStates.CHOOSING_WORD:
					this.emit(GameEngineEvents.CHOOSING_WORD, true);
					break;
				case GameStates.STARTED:
					this.emit(GameEngineEvents.GAME_STARTED, true);
					break;
				case GameStates.STOPPED:
					this.emit(GameEngineEvents.GAME_STOPPED, true);
					break;
			}
		}
	}

	// emitter wrapper
	emit(type: GameEngineEvents, ...args: any[]) {
		this.emitter.emit(type, args);
	}

	// emitter wrapper
	on(type: GameEngineEvents, listener: (...args: any[]) => void) {
		this.emitter.on(type, listener);
	}

	// emitter wrapper
	off(type: GameEngineEvents, listener: (...args: any[]) => void) {
		this.emitter.off(type, listener);
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

	setupGame(game: GameState) {
		clearInterval(this.timer);

		this.transact(() => {
			for (const key in game) {
				this.gameState.set(key, game[key]);
			}
			this.resetTime();
		});
	}

	resetTime() {
		this.time = 5;
	}

	startGame() {
		const state = this.state;
		if (state === GameStates.STARTED || state === GameStates.CHOOSING_WORD) return;

		this.transact(() => {
			this.resetTime();
			this.gameState.set('state', GameStates.STARTED);
		});

		// setup the game time
		this.timer = setInterval(() => {
			const time = this.time - 1;
			this.time = time;

			if (time < 1) {
				if (this.currentRound <= this.rounds) this.nextRound();
				else this.stopGame();
			}
		}, 1000);
	}

	stopGame() {
		clearInterval(this.timer);
		this.gameState.set('state', GameStates.STOPPED);
	}

	nextRound() {
		const round = this.currentRound + 1;
		this.gameState.doc.transact(() => {
			this.gameState.set('currentRound', round);
			this.resetTime();
		});
	}
}
