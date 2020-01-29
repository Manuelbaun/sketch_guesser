import { Subject } from 'rxjs';
import { GameStorePort } from './game_store.port';
import { GameModelProp, GameEvents, GameStates, GameModel, GameModelKeys } from './game.model';

import { ServiceInterface } from '../base/service.interface';
import { hashString } from '../../util';
import { PersistentStore } from '../../service';

/**
 * Events 
 */
interface GameEvent {
	type: GameEvents;
	value?: any;
}

/**
 * Utility function to create GameService Events
 * faster then using class. Use this, until, a class is needed
 * meanwhile plain objects are fine
 * 
 * @param type : GameEvents
 * @param value : any
 */
const createEvent = (type: GameEvents, value?: any): GameEvent => {
	return {
		type,
		value
	} as GameEvent;
};

export class GameService implements ServiceInterface<GameEvent> {
	private _timer: NodeJS.Timeout;
	private _adapter: GameStorePort;
	private _subject = new Subject<GameEvent>();

	get subject(): Subject<GameEvent> {
		console.log('someone is using the subject');
		return this._subject;
	}

	constructor(adapter: GameStorePort) {
		this._adapter = adapter;

		this._adapter.onUpdate((prop: GameModelProp) => {
			Object.entries(prop).forEach(([ key, value ]) => {
				this._handleGameStateChanged(key as GameModelKeys, value);
			});
		});
	}

	dispose() {
		console.log('GameService dispose');
		clearInterval(this._timer);
		this._subject.complete();
	}

	// sorted after probability of occurring
	private _handleGameStateChanged(key: GameModelKeys, value: any): void {
		if (this._subject.observers.length === 0) return;

		if (key === 'time') {
			this._subject.next(createEvent(GameEvents.CLOCK_UPDATE, value));
		} else if (key === 'state') {
			// Map state to Events
			switch (value) {
				case GameStates.CHOOSING_WORD:
					this._subject.next(createEvent(GameEvents.CHOOSING_WORD));
					break;
				case GameStates.WAITING:
					this._subject.next(createEvent(GameEvents.GAME_PAUSED));
					break;
				case GameStates.STARTED:
					this._subject.next(createEvent(GameEvents.GAME_STARTED));
					break;
				case GameStates.STOPPED:
					this._subject.next(createEvent(GameEvents.GAME_STOPPED));
					break;
			}
		} else if (key === 'round') {
			this._subject.next(createEvent(GameEvents.ROUND_CHANGE, value));
		}
	}

	setupGame(props: GameModelProp): void {
		console.log('Setup Game');
		const prop = {
			codeWordHash: (props.codeWordHash && hashString(props.codeWordHash)) || hashString('test'),
			round: props.round || 1,
			roundsPerGame: props.roundsPerGame || 3,
			currentMasterID: props.currentMasterID || PersistentStore.id,
			state: props.state || GameStates.WAITING,
			time: props.time || 60,
			timePerRound: props.timePerRound || 60
		} as GameModel;

		clearInterval(this._timer);
		this._adapter.updateProp(prop);
	}

	startGame(): void {
		const state = this._adapter.get('state');

		if (state === GameStates.STARTED || state === GameStates.CHOOSING_WORD) return;

		console.log('START GAME');
		this._adapter.updateProp({
			state: GameStates.STARTED
		});
		// setup the game time
		clearInterval(this._timer);
		this._timer = setInterval(() => {
			const time = this._adapter.get('time') as number;
			this._adapter.set('time', time - 1);

			if (time < 1) {
				const round = this._adapter.get('round') as number;
				const roundsPerGame = this._adapter.get('roundsPerGame') as number;

				if (round <= roundsPerGame) this.nextRound();
				else this.stopGame();
			}
		}, 1000);
	}

	stopGame(): void {
		console.debug('Game Stopped');
		clearInterval(this._timer);
		this._adapter.set('state', GameStates.STOPPED);
	}

	// TODO: think, how to update via transact here....
	nextRound(): void {
		const round = this._adapter.get('round') as number;
		const timePerRound = this._adapter.get('timePerRound') as number;

		this._adapter.set('round', round + 1);
		this._adapter.set('time', timePerRound);
	}

	setNewGuessWord(value: string): void {
		this._adapter.set('codeWordHash', hashString(value));
	}

	get time(): number {
		return this._adapter.get('time') as number;
	}
	get roundsPerGame(): number {
		return this._adapter.get('roundsPerGame') as number;
	}
	get round(): number {
		return this._adapter.get('round') as number;
	}

	get gameState(): GameStates {
		return this._adapter.get('state') as GameStates;
	}

	isGameRunning(): boolean {
		const state = this.gameState;
		return state === GameStates.CHOOSING_WORD || state === GameStates.STARTED;
	}
}
