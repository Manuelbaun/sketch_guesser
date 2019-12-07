import * as Y from 'yjs';
import sha256 from 'sha256';
import { Subscription } from 'rxjs';
import { EventEmitter } from 'events';
import { filter } from 'rxjs/operators';
import { Data, DataTypes, CommunicationServiceInterface } from '../service/communication/communication.type';

export enum GameEngineEvents {
	CLOCK = 'CLOCK',
	STATE_CHANGE = 'STATE_CHANGE'
}

export enum GameStates {
	NEXT_ROUND = 'NEXT_ROUND',
	MASTER_CHANGED = 'MASTER_CHANGED',
	CHOOSE_WORD = 'CHOOSE_WORD',
	WAITING = 'WAITING',
	STARTED = 'STARTED',
	FINISHED = 'FINISHED'
}

export type GameState = {
	currentMasterID: string;
	currentRound: number;
	rounds: number;
	codeWordHash: string;
	state: GameStates;
};

export default class GameEngine {
	private yDoc = new Y.Doc();
	private gameState = this.yDoc.getMap('gameState');
	private clock = this.yDoc.getMap('clock');
	private emitter: EventEmitter = new EventEmitter();

	constructor(comm: CommunicationServiceInterface) {
		this.yDoc.on('update', (update) => {
			const data: Data = {
				type: DataTypes.GAME,
				payload: update
			};
			comm.sendDataAll(data);
		});

		// subscribe to game data with filter
		const _filter = (data: Data) => data.type === DataTypes.GAME;
		this.sub = comm.dataStream.pipe(filter(_filter)).subscribe({
			next: (data) => Y.applyUpdate(this.yDoc, data.payload)
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

	private sub: Subscription;

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
	gameStarted = false;
	startGame(game: GameState) {
		this.gameStarted = true;
		this.yDoc.transact(() => {
			for (const key in game) {
				this.gameState.set(key, game[key]);
			}
		});

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

	nextRound() {}
}
