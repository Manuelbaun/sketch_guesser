import React, { useEffect, useState } from 'react';

import { Player } from '../../models';
import { GameEngine, PlayerEngine } from '../../engines';
import { GameControl, Input, Avatar } from '../../components';
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
									<Avatar name={player.name} />
								</td>
								<td>{playerEngine.localID == player.id ? player.name + ' (You)' : player.name}</td>
								<td>{player.points}</td>
								<td>{player.id}</td>
								<td>{player.online ? 'online' : 'offline'}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};
