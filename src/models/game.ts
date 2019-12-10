/**
 * Use with gameEngine event emitter
 */
export enum GameEvents {
	CLOCK_UPDATE = 'CLOCK_UPDATE',
	ROUND_CHANGE = 'ROUND_CHANGE',
	MASTER_CHANGED = 'MASTER_CHANGED',
	CHOOSING_WORD = 'WORD_CHANGED',
	GAME_STARTED = 'GAME_STARTED',
	GAME_PAUSED = 'GAME_PAUSED',
	GAME_STOPPED = 'GAME_STOPPED'
}

/**
 * GameState in the Gamestate YDoc
 */
export enum GameStates {
	WAITING = 'WAITING',
	CHOOSING_WORD = 'CHOOSE_WORD',
	STARTED = 'STARTED',
	STOPPED = 'STOPPED'
}

/**
 * Structure of the Gamestate
 */
export interface Game {
	currentMasterID: string;
	currentRound: number;
	rounds: number;
	codeWordHash: string;
	state: GameStates;
}
