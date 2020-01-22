import React, { useEffect, useState } from 'react';

import { Player } from '../../models';
import { GameEngine, PlayerEngine } from '../../game_engine';
import { GameControl, Input, P2PGraph } from '../../components';
import { getPublicIpAddress } from '../../service/communication';
import './room.css';

import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';

type MenuProps = {
	gameEngine: GameEngine;
	playerEngine: PlayerEngine;
};

const avatars = new Avatars(sprites());
const map = new Map<string, string>();
const createAvatar = (name: string) => {
	if (map.has(name)) return map.get(name);

	const svgString = avatars.create(name);
	const blob = new Blob([ svgString ], { type: 'image/svg+xml' });
	const svgAvatar = URL.createObjectURL(blob);

	map.set(name, svgAvatar);
	return map.get(name);
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
				setIpAddress(data.msg);
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
			<table className="player-table">
				<thead>
					<tr className="player-disp">
						<th />
						<th>Name</th>
						<th>Points</th>
						<th>ID</th>
						<th>State</th>
					</tr>
				</thead>
				<tbody>
					{players.length > 0 &&
						players.map((player) => (
							<tr key={player.id} className="player-disp">
								<td>
									<img src={createAvatar(player.name)} height="100" width="100" />
								</td>
								<td>{playerEngine.localID == player.id ? player.name + ' (You)' : player.name}</td>
								<td>{player.points}</td>
								<td>{player.clientId}</td>
								<td>{player.online ? 'online' : 'offline'}</td>
							</tr>
						))
					// <P2PGraph players={players} localID={playerEngine.localID} playerEngine={playerEngine} />
					}
				</tbody>
			</table>
		</div>
	);
};

//
