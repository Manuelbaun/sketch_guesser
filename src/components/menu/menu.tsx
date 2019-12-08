import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import P2PGraph from './p2pGraph';
import Input from '../../common/input';
import { CommunicationServiceInterface } from '../../service/communication/communication.type';
import GameEngine from '../../engine/game.engine';
import { GameStates } from '../../engine/game.types';
import PlayerEngine from '../../engine/player.engine';

interface MenuInterface {
	comm: CommunicationServiceInterface;
	gameEngine: GameEngine;
	playerEngine: PlayerEngine;
}

const Menu: React.FC<MenuInterface> = ({ comm, gameEngine: engine, playerEngine }) => {
	const setupGame = () => {
		engine.setupGame({
			codeWordHash: '',
			currentRound: 1,
			rounds: 3,
			currentMasterID: comm.localID,
			state: GameStates.WAITING
		});
	};

	useEffect(() => setupGame(), []);

	const handleSubmit = (msg: string) => {
		playerEngine.updateLocalName(msg);
	};

	const startGame = () => {
		engine.guessWord = 'test';

		engine.startGame();
	};

	const stopGame = () => engine.stopGame();
	const nextRound = () => engine.nextRound();

	return (
		<div className="menu">
			<Input
				onSubmit={(msg) => handleSubmit(msg)}
				options={{ placeholder: 'your name', label: 'Alias', buttonLabel: 'Submit' }}
			/>
			<Button onClick={startGame}> START </Button>
			<Button onClick={stopGame}> Stop </Button>
			<Button onClick={setupGame}> Reset </Button>
			<Button onClick={nextRound}> Next Round </Button>
			<P2PGraph engine={playerEngine} />
		</div>
	);
};

export default Menu;
