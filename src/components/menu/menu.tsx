import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Input from '../common/input';
import P2PGraph from './p2pGraph/p2pGraph';
import { CommunicationServiceInterface } from '../../service/communication';
import { GameStates } from '../../models';
import { GameEngine, PlayerEngine } from '../../gameEngine';

interface MenuProps {
	comm: CommunicationServiceInterface;
	gameEngine: GameEngine;
	playerEngine: PlayerEngine;
}

const Menu: React.FC<MenuProps> = ({ comm, gameEngine: engine, playerEngine }) => {
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
