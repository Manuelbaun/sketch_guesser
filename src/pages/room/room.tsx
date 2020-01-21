import React, { useEffect, useState } from 'react';

import { Player } from '../../models';
import { GameEngine, PlayerEngine } from '../../game_engine';
import { GameControl, Input, P2PGraph } from '../../components';
import './room.css';

type MenuProps = {
	gameEngine: GameEngine;
	playerEngine: PlayerEngine;
};

export const RoomPage: React.FC<MenuProps> = ({ gameEngine, playerEngine }) => {
	const [ players, setPlayers ] = useState<Array<Player>>(playerEngine.getAllPlayers());

	const handleSubmit = (msg: string) => {
		playerEngine.updateLocalName(msg);
	};

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
			<GameControl gameEngine={gameEngine} />
			<Input
				onSubmit={(msg) => handleSubmit(msg)}
				options={{ placeholder: 'your name', label: 'Alias', buttonLabel: 'Submit' }}
			/>
			{players.length > 0 && players.map((player) => <div className="player-disp">{player.name}</div>)
			// <P2PGraph players={players} localID={playerEngine.localID} playerEngine={playerEngine} />
			}
		</div>
	);
};
