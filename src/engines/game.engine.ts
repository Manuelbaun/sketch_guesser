import { Subscription, Subject } from 'rxjs';
import { GameStates, GameEvents, IGameModel, GameStoreKeys, GameEngineEvents } from '../models';
import { IGameService } from '../service/game/game.service';
import EngineInterface from './engine.interface';
import { PersistentStore } from '../service';
import { IKeyValue } from '../service/sync/game_store.adapter';

/**
 * Utility function to create GameEngine Events
 * faster then using class. Use this, until, a class is needed
 * meanwhile plain objects are fine
 * 
 * @param type : GameEvents
 * @param value : any
 */
const createEvent = (type: GameEvents, value?: any): GameEngineEvents => {
	return {
		type,
		value
	};
};

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

	// sorted after probability of occurring
	private _handleGameStateChanged = ({ key, value }: IKeyValue) => {
		if (key === GameStoreKeys.TIME) {
			this.next(createEvent(GameEvents.CLOCK_UPDATE, value));
		} else if (key === GameStoreKeys.STATE) {
			// Map state to Events
			switch (value) {
				case GameStates.CHOOSING_WORD:
					this.next(createEvent(GameEvents.CHOOSING_WORD));
					break;
				case GameStates.WAITING:
					// ??? do we need this Event
					this.next(createEvent(GameEvents.GAME_PAUSED));
					break;
				case GameStates.STARTED:
					this.next(createEvent(GameEvents.GAME_STARTED));
					break;
				case GameStates.STOPPED:
					this.next(createEvent(GameEvents.GAME_STOPPED));
					break;
			}
		} else if (key === GameStoreKeys.ROUND) {
			this.next(createEvent(GameEvents.ROUND_CHANGE, value));
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
