import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

import { GameStates } from '../../models';
import { GameEngineInterface } from '../../engines';
import { PersistentStore } from '../../service/storage';

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
	const setupGame = () => {
		gameEngine.setupGame({
			codeWordHash: '',
			currentRound: 1,
			rounds: 3,
			currentMasterID: PersistentStore.clientID.toString(),
			state: GameStates.WAITING
		});
	};

	const startGame = () => {
		gameEngine.guessWord = 'test';
		setupGame();
		setGameStarted(true);
		gameEngine.startGame();
	};

	const resetGame = () => {
		setupGame();
		startGame();
	};

	const stopGame = () => {
		setGameStarted(false);
		gameEngine.stopGame();
	};
	const nextRound = () => gameEngine.nextRound();

	const cancelGame = () => {
		stopGame();
		onCancel();
	};
	console.log('game stated', gameStarted);
	return (
		<div className="game-controller">
			<Button onClick={startGame} disabled={gameStarted}>
				START
			</Button>
			<Button onClick={stopGame}> Stop </Button>
			<Button onClick={resetGame}> Reset </Button>
			<Button onClick={nextRound}> Next Round </Button>
			<Button onClick={cancelGame}> Go Back to Menu </Button>
		</div>
	);
};
