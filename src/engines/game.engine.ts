import { EventEmitter } from 'events';
import { CacheStoreInterface, Transact } from '../service/sync/cache';
import { GameProps, GameStates, GameEvents, GameModel } from '../models';
import EngineInterface from './engine.interface';
import { GameStoreAdapter } from '../service/sync/game_store.adapter';
import { Subscription } from 'rxjs';

export interface GameEngineInterface extends EngineInterface {
	// emitter wrapper
	emit(type: GameEvents, ...args: any[]);
	handleGameStateChanged(key: string, value: any);
	nextRound();
	// emitter wrapper
	off(type: GameEvents, listener: (...args: any[]) => void);
	// emitter wrapper
	on(type: GameEvents, listener: (...args: any[]) => void);
	resetTime();
	setupGame(game: GameProps);
	startGame();
	stopGame();

	model: GameModel;
}

export class GameEngine implements GameEngineInterface {
	private _emitter: EventEmitter = new EventEmitter();
	private _timer: NodeJS.Timeout;
	private _model: GameModel;
	public get model() {
		return this._model;
	}

	// Executes transaction in a batch
	private _transact: Transact;

	private _gameStoreAdapter: GameStoreAdapter;
	constructor(store: CacheStoreInterface) {
		this._transact = store.transact;

		this._gameStoreAdapter = new GameStoreAdapter(store);
		this._model = this._gameStoreAdapter.gameModel;

		this._sub = this._model.subscribe(({ key, value }) => {
			this.handleGameStateChanged(key, value);
		});

		console.log('GameEngine init');
	}

	private _sub: Subscription;

	dispose() {
		this._sub.unsubscribe();
		this._model.dispose();
		console.log('GameEngine dispose');
	}

	handleGameStateChanged(key: string, value: any) {
		if (key === 'currentRound') {
			this.emit(GameEvents.ROUND_CHANGE, value);
		}

		// Map state to Events
		if (key === 'state') {
			this.emit(value, true);

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

		if (key === 'time') {
			this.emit(GameEvents.CLOCK_UPDATE, this._model.time);
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

	setupGame(game: GameProps) {
		clearInterval(this._timer);

		this._model.setProps(game);
		this.resetTime();
	}

	resetTime() {
		this._model.time = 60;
	}

	startGame() {
		const state = this._model.state;
		if (state === GameStates.STARTED || state === GameStates.CHOOSING_WORD) return;
		console.log(this);
		this._transact(() => {
			this.resetTime();
			this._model.state = GameStates.STARTED;
		});

		// setup the game time
		clearInterval(this._timer);
		this._timer = setInterval(() => {
			this._model.time -= 1;

			if (this._model.time < 1) {
				if (this._model.currentRound <= this._model.rounds) this.nextRound();
				else this.stopGame();
			}
		}, 1000);
	}

	stopGame() {
		clearInterval(this._timer);
		this._model.state = GameStates.STOPPED;
	}

	nextRound() {
		this._model.currentRound += 1;
		this.resetTime();
	}
}
