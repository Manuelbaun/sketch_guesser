import React, { useEffect, useState } from 'react';

import { Player } from '../../models';
import { GameEngine, PlayerEngine } from '../../game_engine';
import { GameControl, Input, P2PGraph } from '../../components';
import { getPublicIpAddress } from '../../service/communication';
import './room.css';

type MenuProps = {
	gameEngine: GameEngine;
	playerEngine: PlayerEngine;
};

export const RoomPage: React.FC<MenuProps> = ({ gameEngine, playerEngine }) => {
	const [ players, setPlayers ] = useState<Array<Player>>(playerEngine.getAllPlayers());
	const [ ipAddress, setIpAddress ] = useState<string>('');
	const handleSubmit = (msg: string) => {
		playerEngine.updateLocalName(msg);
	};

	useEffect(() => {
		const sub = playerEngine.subscribe((players) => {
			setPlayers(players);
		});

		getPublicIpAddress()
			.then((data: any) => {
				console.log(data.msg);

				setIpAddress(data.msg.ip);
			})
			.catch((err) => console.error(err));

		return () => {
			sub.unsubscribe();
		};
	});

	return (
		<div className="menu">
			<div className="player-disp"> Your IP address: {ipAddress} </div>
			<GameControl gameEngine={gameEngine} />
			<Input
				onSubmit={(msg) => handleSubmit(msg)}
				options={{ placeholder: 'your name', label: 'Alias', buttonLabel: 'Submit' }}
			/>
			{players.length > 0 &&
			<P2PGraph players={players} localID={playerEngine.localID} playerEngine={playerEngine} />
			}
		</div>
	);
};

// players.map((player) => <div className="player-disp">{player.name}</div>)