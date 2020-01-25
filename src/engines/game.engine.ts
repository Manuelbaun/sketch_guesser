import { Subscription, Subject } from 'rxjs';
import { GameStates, GameEvents, IGameModel, GameStoreKeys } from '../models';
import { IGameService } from '../service/game/game.service';
import EngineInterface from './engine.interface';
import { PersistentStore } from '../service';
import { IKeyValue } from '../service/sync/game_store.adapter';

export interface GameEngineInterface extends Subject<GameEngineEvents>, EngineInterface {
	setupGame(game?: IGameModel);
	startGame();
	stopGame();
	nextRound();
	setNewGuessWord(value: string);

	time: number;
	roundsPerGame: number;
	round: number;
}

interface GameEngineEvents {
	type: GameEvents;
	value: any;
}

export class GameEngine extends Subject<GameEngineEvents> implements GameEngineInterface {
	private _timer: NodeJS.Timeout;
	private _service: IGameService;

	constructor(service: IGameService) {
		super();

		this._service = service;
		this._sub = this._service.subscribe(this._handleGameStateChanged);

		this.subscribe((event) => {
			console.log('GAME-Engine-EVENTs', event);
		});
		console.log('GameEngine init');
	}

	private _sub: Subscription;

	dispose() {
		this._sub.unsubscribe();
		console.log('GameEngine dispose');
	}

	private _handleGameStateChanged = (event: IKeyValue) => {
		const { key, value } = event;

		if (key === GameStoreKeys.ROUND) {
			this.next({ type: GameEvents.ROUND_CHANGE, value });
		}

		// Map state to Events
		if (key === GameStoreKeys.STATE) {
			switch (value) {
				case GameStates.WAITING:
					this.next({ type: GameEvents.GAME_PAUSED, value: true });
					break;
				case GameStates.CHOOSING_WORD:
					this.next({ type: GameEvents.CHOOSING_WORD, value: true });
					break;
				case GameStates.STARTED:
					this.next({ type: GameEvents.GAME_STARTED, value: true });
					break;
				case GameStates.STOPPED:
					this.next({ type: GameEvents.GAME_STOPPED, value: true });
					break;
			}
		}

		if (key === GameStoreKeys.TIME) {
			this.next({ type: GameEvents.CLOCK_UPDATE, value: this._service.time });
		}
	};

	setupGame(gameProps?: IGameModel) {
		console.log('Setup Game');
		let props;
		if (gameProps) {
			props = gameProps;
		} else {
			props = {
				codeWordHash: 'test',
				round: 1,
				roundsPerGame: 3,
				currentMasterID: PersistentStore.clientID.toString(),
				state: GameStates.WAITING,
				time: 60,
				timePerRound: 60
			} as IGameModel;
		}

		clearInterval(this._timer);
		this._service.setProps(props);
	}

	startGame() {
		const state = this._service.state;
		if (state === GameStates.STARTED || state === GameStates.CHOOSING_WORD) return;

		console.log('START GAME');
		this._service.state = GameStates.STARTED;
		// setup the game time
		clearInterval(this._timer);
		this._timer = setInterval(() => {
			this._service.time -= 1;

			if (this._service.time < 1) {
				if (this._service.round <= this._service.roundsPerGame) this.nextRound();
				else this.stopGame();
			}
		}, 1000);
	}

	stopGame() {
		console.debug('Game Stopped');
		clearInterval(this._timer);
		this._service.state = GameStates.STOPPED;
	}

	// TODO: think, how to update via transact here....
	nextRound() {
		this._service.round += 1;
		this._service.time = this._service.timePerRound;
	}

	setNewGuessWord(value: string) {
		this._service.codeWordHash = value;
	}

	get time() {
		return this._service.time;
	}
	get roundsPerGame() {
		return this._service.roundsPerGame;
	}
	get round() {
		return this._service.round;
	}
}
