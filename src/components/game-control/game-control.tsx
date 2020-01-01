import React from 'react';
import Button from 'react-bootstrap/Button';

import { GameStates } from '../../models';
import { GameEngine } from '../../gameEngine';
import { PersistentStore } from '../../service/storage';

import './game-control.css';

type Props = {
	gameEngine: GameEngine;
};

/**
 * @param param 
 * 
 * This class provides buttons to start, stop, or reset the Game. It is just for
 * prototype purpose. It also provides a button to go to the next round.
 */
export const GameControl = ({ gameEngine }: Props) => {
	const setupGame = () => {
		gameEngine.setupGame({
			codeWordHash: '',
			currentRound: 1,
			rounds: 3,
			currentMasterID: PersistentStore.localID,
			state: GameStates.WAITING
		});
	};

	const startGame = () => {
		gameEngine.guessWord = 'test';
		gameEngine.startGame();
	};

	const stopGame = () => gameEngine.stopGame();
	const nextRound = () => gameEngine.nextRound();

	return (
		<div className="game-controller">
			<Button onClick={startGame}> START </Button>
			<Button onClick={stopGame}> Stop </Button>
			<Button onClick={setupGame}> Reset </Button>
			<Button onClick={nextRound}> Next Round </Button>
		</div>
	);
};
