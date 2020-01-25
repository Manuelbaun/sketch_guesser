/**
 * GameState in the Gamestate YDoc
 */
export enum GameStates {
	WAITING = 'WAITING',
	CHOOSING_WORD = 'CHOOSE_WORD',
	STARTED = 'STARTED',
	STOPPED = 'STOPPED'
}

export const GAME_STORE_NAME = 'gameState';
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
