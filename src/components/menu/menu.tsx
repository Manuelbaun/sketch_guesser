import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Input } from '../common';
import { P2PGraph } from './p2pGraph/p2pGraph';

import { GameStates, Player } from '../../models';
import { GameEngine, PlayerEngine } from '../../gameEngine';
import { PersistentStore } from '../../service/storage';

type MenuProps = {
	gameEngine: GameEngine;
	playerEngine: PlayerEngine;
};

export const Menu: React.FC<MenuProps> = ({ gameEngine, playerEngine }) => {
	const setupGame = () => {
		gameEngine.setupGame({
			codeWordHash: '',
			currentRound: 1,
			rounds: 3,
			currentMasterID: PersistentStore.localID,
			state: GameStates.WAITING
		});
	};

	useEffect(() => setupGame(), []);

	const [ players, setPlayers ] = useState<Array<Player>>(playerEngine.getAllPlayers());

	const handleSubmit = (msg: string) => {
		playerEngine.updateLocalName(msg);
	};

	const startGame = () => {
		gameEngine.guessWord = 'test';

		gameEngine.startGame();
	};

	const stopGame = () => gameEngine.stopGame();
	const nextRound = () => gameEngine.nextRound();

	useEffect(() => {
		const sub = playerEngine.subscribe((players) => {
			setPlayers(players);
		});

		return () => {
			sub.unsubscribe();
		};
	});

	return (
		<div className="menu">
			<Button onClick={startGame}> START </Button>
			<Button onClick={stopGame}> Stop </Button>
			<Button onClick={setupGame}> Reset </Button>
			<Button onClick={nextRound}> Next Round </Button>
			<Input
				onSubmit={(msg) => handleSubmit(msg)}
				options={{ placeholder: 'your name', label: 'Alias', buttonLabel: 'Submit' }}
			/>
			<P2PGraph players={players} localID={playerEngine.localID} />
		</div>
	);
};
