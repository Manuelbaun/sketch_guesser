import React, { useEffect, useState, useContext } from 'react';
import { Input, Avatar } from '../../ui-components';
import { Player } from '../../components/player';

import './waiting_room.css';
import { AppContext } from '../../App';

export const WaitingRoom: React.FC = (props) => {
	const { service: { playerService } } = useContext(AppContext);

	const [ players, setPlayers ] = useState<Player[]>(playerService.players);
	const handleSubmit = (name: string): void => {
		playerService.updateName(name);
	};

	useEffect(() => {
		const sub = playerService.subject.subscribe((players) => {
			setPlayers(players);
		});

		return (): void => {
			sub.unsubscribe();
		};
	});

	return (
		<div className="menu">
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
					{players.map((player) => (
						<PlayerRow key={player.id} player={player} local={playerService.isLocalPlayer(player.id)} />
					))}
				</tbody>
			</table>
		</div>
	);
};

//
interface PlayerRowProps {
	player: Player;
	local: boolean;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, local }) => {
	if (player.gone()) return <React.Fragment />;

	return (
		<tr key={player.id} className={player.online() ? 'player-disp' : 'player-disp-offline'}>
			<td>
				<Avatar name={player.name} />
			</td>
			<td>{local ? player.name + ' (You)' : player.name}</td>
			<td>{player.points}</td>
			<td>{player.id}</td>
			<td>{player.online() ? 'online' : 'offline'}</td>
		</tr>
	);
};
