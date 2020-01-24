import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { GameStates } from '../../models';
import { GameEngineInterface } from '../../engines';
import { PersistentStore } from '../../service/sync';

import './game_control.css';

type Props = {
	gameEngine: GameEngineInterface;
	goBackToMenu: Function;
};

/**
 * @param param 
 * 
 * This class provides buttons to start, stop, or reset the Game. It is just for
 * prototype purpose. It also provides a button to go to the next round.
 */
export const GameControl = ({ gameEngine, goBackToMenu: onCancel }: Props) => {
	const [ gameStarted, setGameStarted ] = useState(false);

	const startGame = () => {
		console.debug('Start Game');
		gameEngine.setNewGuessWord('test');
		gameEngine.setupGame({
			codeWordHash: '',
			currentRound: 1,
			rounds: 3,
			currentMasterID: PersistentStore.clientID.toString(),
			state: GameStates.WAITING,
			currentTime: 60,
			timePerRound: 60
		});
		setGameStarted(true);
		gameEngine.startGame();
	};

	const stopGame = () => {
		console.debug('Game Stopped');
		setGameStarted(false);
		gameEngine.stopGame();
	};

	const nextRound = () => gameEngine.nextRound();

	const cancelGame = () => {
		stopGame();
		onCancel();
	};
	console.debug('Game Started: ', gameStarted);
	return (
		<div className="game-controller">
			<Button onClick={startGame} disabled={gameStarted}>
				START
			</Button>
			<Button onClick={stopGame}> Stop </Button>
			<Button onClick={startGame}> Reset </Button>
			<Button onClick={nextRound}> Next Round </Button>
			<Button onClick={cancelGame}> Go Back to Menu </Button>
		</div>
	);
};
