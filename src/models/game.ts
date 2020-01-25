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

export interface GameEngineEvents {
	type: GameEvents;
	value?: any;
}

/**
 * Structure of the GameModel
 */
export interface IGameModel {
	currentMasterID: string;
	codeWordHash: string;
	round: number;
	roundsPerGame: number;
	state: GameStates;
	timePerRound: number;
	time: number;
}

/**
 * The following enums and const are used to set the key withing the yjs map
 * therefore, no "strings" needs to be used directly. Use the Keys to access 
 * the right property of the map. No other keys are needed
 */

/**
 * The name of the game store within the yjs doc
 */
export const GAME_STORE_NAME = 'game';
/**
 * 
 */
export enum GameStoreKeys {
	CURRENT_MASTER_ID = 'currentMasterID',
	CODE_WORD_HASH = 'codeWordHash',
	ROUND = 'round',
	ROUNDS_PER_GAME = 'roundsPerGame',
	STATE = 'state',
	TIME_PER_ROUND = 'timePerRound',
	TIME = 'time'
}
