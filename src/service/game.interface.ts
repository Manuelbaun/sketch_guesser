export default interface GameInterface {
	rounds: number;
	currentRound: number;
	players: number;
	codeWord: string;
	codeWordHash: string | number[];
};
