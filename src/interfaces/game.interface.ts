export default interface GameInterface {
	gameID: string;
	currentMasterID: string;
	rounds: number;
	currentRound: number;
	players: number;
	codeWord: string;
	codeWordHash: string | number[];
};
