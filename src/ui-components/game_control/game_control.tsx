import React from 'react';
import Button from 'react-bootstrap/Button';
import { GameService } from '../../components/game/game.service';

import './game_control.css';

type Props = {
	service: GameService;
	onCancel: Function;
};

/**
 * @param param 
 * 
 * This class provides buttons to start, stop, or reset the Game. It is just for
 * prototype purpose. It also provides a button to go to the next round.
 */
export const GameControl = ({ service, onCancel }: Props) => {
	const startGame = (): void => {
		service.setupGame({});
		service.startGame();
	};

	const stopGame = (): void => service.stopGame();
	const nextRound = (): void => service.nextRound();

	const cancelGame = (): void => {
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
