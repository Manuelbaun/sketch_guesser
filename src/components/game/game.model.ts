/**
 * The GameModelProp allows to just use one 
 * of the props, 
 */
export interface GameModelProp {
	currentMasterID?: number;
	codeWordHash?: string;
	round?: number;
	roundsPerGame?: number;
	state?: GameStates;
	timePerRound?: number;
	time?: number;
}

/**
 * The GameModel needs all of the props!
 */
export interface GameModel extends GameModelProp {
	currentMasterID: number;
	codeWordHash: string;
	round: number;
	roundsPerGame: number;
	state: GameStates;
	timePerRound: number;
	time: number;
}

export type GameModelKeys = keyof GameModel;

/**
 * The States the Game can be
 */
export enum GameStates {
	WAITING = 'WAITING',
	CHOOSING_WORD = 'CHOOSE_WORD',
	STARTED = 'STARTED',
	STOPPED = 'STOPPED'
}

/**
 * Game Events
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

export const GAME_STORE_NAME = 'game';
