import { EventEmitter } from 'events';
import { Subscription, Subject } from 'rxjs';
import { GameStates, GameEvents, IGameModel } from '../models';
import { IGameService } from '../service/game/game.service';
import EngineInterface from './engine.interface';
import { IKeyValue } from '../service/sync/game_store.adapter';

export interface GameEngineInterface extends Subject<GameEngineEvents>, EngineInterface {
	setupGame(game: IGameModel);
	startGame();
	stopGame();
	nextRound();
	setNewGuessWord(value: string);

	time: number;
	rounds: number;
	currentRound: number;
}

interface GameEngineEvents {
	key: GameEvents;
	value: any;
}

export class GameEngine extends Subject<GameEngineEvents> implements GameEngineInterface {
	private _timer: NodeJS.Timeout;
	private _service: IGameService;

	constructor(service: IGameService) {
		super();

		this._service = service;

		this._sub = this._service.subscribe(({ key, value }) => {
			console.log('Hansle Updates', key, value);
			this._handleGameStateChanged(key, value);
		});

		console.log('GameEngine init');

		this.subscribe((event) => {
			console.log('GAME-Engine-EVENTs', event);
		});
	}

	private _sub: Subscription;

	dispose() {
		this._sub.unsubscribe();
		console.log('GameEngine dispose');
	}

	private _handleGameStateChanged(key: string, value: any) {
		if (key === 'currentRound') {
			this.next({ key: GameEvents.ROUND_CHANGE, value });
		}

		// Map state to Events
		if (key === 'state') {
			switch (value) {
				case GameStates.WAITING:
					this.next({ key: GameEvents.GAME_PAUSED, value: true });
					break;
				case GameStates.CHOOSING_WORD:
					this.next({ key: GameEvents.CHOOSING_WORD, value: true });
					break;
				case GameStates.STARTED:
					this.next({ key: GameEvents.GAME_STARTED, value: true });
					break;
				case GameStates.STOPPED:
					this.next({ key: GameEvents.GAME_STOPPED, value: true });
					break;
			}
		}

		if (key === 'time') {
			this.next({ key: GameEvents.CLOCK_UPDATE, value: this._service.currentTime });
		}
	}

	setupGame(game: IGameModel) {
		clearInterval(this._timer);
		this._service.setProps(game);
	}

	startGame() {
		const state = this._service.state;
		if (state === GameStates.STARTED || state === GameStates.CHOOSING_WORD) return;

		console.log('START GAME');
		this._service.state = GameStates.STARTED;
		// setup the game time
		clearInterval(this._timer);
		this._timer = setInterval(() => {
			this._service.currentTime -= 1;

			if (this._service.currentTime < 1) {
				if (this._service.currentRound <= this._service.rounds) this.nextRound();
				else this.stopGame();
			}
		}, 1000);
	}

	stopGame() {
		clearInterval(this._timer);
		this._service.state = GameStates.STOPPED;
	}

	// TODO: think, how to update via transact here....
	nextRound() {
		this._service.currentRound += 1;
		this._service.currentTime = this._service.timePerRound;
	}

	setNewGuessWord(value: string) {
		this._service.codeWordHash = value;
	}

	get time() {
		return this._service.currentTime;
	}
	get rounds() {
		return this._service.rounds;
	}
	get currentRound() {
		return this._service.currentRound;
	}
}
