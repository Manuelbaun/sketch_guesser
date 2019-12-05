export default interface GameInterface {
	gameID: string;
	currentMasterID: string;
	rounds: number;
	currentRound: number;
	codeWord: string;
	codeWordHash: string | number[];
};
