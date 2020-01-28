import React, { useEffect, useState } from 'react';
import { IPlayer } from '../../models';
import { PlayerEngineInterface } from '../../engines';
import { Input, Avatar } from '../../ui-components';
import './waiting_room.css';

type Props = {
	playerEngine: PlayerEngineInterface;
};

export const WaitingRoom: React.FC<Props> = ({ playerEngine }) => {
	const [ players, setPlayers ] = useState<Array<IPlayer>>(playerEngine.getAllPlayers());
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
						<PlayerRow
							key={player.clientID}
							player={player}
							local={playerEngine.isLocalPlayer(player.id)}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

//
interface PlayerRowProps {
	player: IPlayer;
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
			<td>{player.clientID}</td>
			<td>{player.online() ? 'online' : 'offline'}</td>
		</tr>
	);
};
