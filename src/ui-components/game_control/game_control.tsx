import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';

import './game_control.css';
import { AppContext } from '../../App';

/**
 * @param param 
 * 
 * This class provides buttons to start, stop, or reset the Game. It is just for
 * prototype purpose. It also provides a button to go to the next round.
 */
export const GameControl = (props) => {
	const { service } = useContext(AppContext);

	const startGame = (): void => service.startGame();
	const stopGame = (): void => service.stopGame();
	const nextRound = (): void => service.nextRound();
	const exitGame = (): void => service.exitGame();

	return (
		<div className="game-controller">
			<Button onClick={startGame}>START</Button>
			<Button onClick={stopGame}> Stop </Button>
			<Button onClick={nextRound}> Next Round </Button>
			<Button onClick={exitGame}> Exit </Button>
		</div>
	);
};
