import React from 'react';
import Button from 'react-bootstrap/Button';
import { GameEngineInterface } from '../../engines';

import './game_control.css';

type Props = {
	gameEngine: GameEngineInterface;
	onCancel: Function;
};

/**
 * @param param 
 * 
 * This class provides buttons to start, stop, or reset the Game. It is just for
 * prototype purpose. It also provides a button to go to the next round.
 */
export const GameControl = ({ gameEngine, onCancel }: Props) => {
	const startGame = () => {
		gameEngine.setupGame();
		gameEngine.startGame();
	};

	const stopGame = () => gameEngine.stopGame();
	const nextRound = () => gameEngine.nextRound();

	const cancelGame = () => {
		stopGame();
		onCancel();
	};

	return (
		<div className="game-controller">
			<Button onClick={startGame}>START</Button>
			<Button onClick={stopGame}> Stop </Button>
			<Button onClick={nextRound}> Next Round </Button>
			<Button onClick={cancelGame}> Go Back to Menu </Button>
		</div>
	);
};
