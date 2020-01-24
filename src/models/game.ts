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
 * Structure of the GameModel
 */
export interface IGameModel {
	currentMasterID: string;
	codeWordHash: string;
	currentRound: number;
	rounds: number;
	state: GameStates;
	timePerRound: number;
	currentTime: number;
}
