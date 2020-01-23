import React, { useEffect, useState } from 'react';

import { Player } from '../../models';
import { PlayerEngineInterface } from '../../engines';
import { Input, Avatar } from '../../components';
import { getPublicIpAddress } from '../../service/communication';
import './waiting_room.css';

type Props = {
	playerEngine: PlayerEngineInterface;
};

export const WaitingRoom: React.FC<Props> = ({ playerEngine }) => {
	const [ players, setPlayers ] = useState<Array<Player>>(playerEngine.getAllPlayers());
	const [ ipAddress, setIpAddress ] = useState<string>('');
	const handleSubmit = (msg: string) => {
		playerEngine.updateLocalName(msg);
	};

	useEffect(() => {
		const sub = playerEngine.subscribe((players) => {
			const online = players.filter((player) => !player.gone);
			setPlayers(online);
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
			<Input
				onSubmit={handleSubmit}
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
							<tr key={player.id} className={player.online ? 'player-disp' : 'player-disp-offline'}>
								<td>
									<Avatar name={player.name} />
								</td>
								<td>{playerEngine.isLocalPlayer(player.id) ? player.name + ' (You)' : player.name}</td>
								<td>{player.points}</td>
								<td>{player.clientID}</td>
								<td>{player.online ? 'online' : 'offline'}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};
