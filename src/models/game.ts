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
