import React, { useContext, useEffect, useState } from 'react';
import { GameControl } from '../../ui-components';
import { WaitingRoom } from './waiting_room';
import { Game } from './game';
import { AppContext } from '../../App';
import { GameEvents } from '../../components/game';

enum GameState {
	WAITING_ROOM,
	PLAY,
	LOADING
}

export const GameScene: React.FC = () => {
	const { service } = useContext(AppContext);
	const [ gameState, setState ] = useState<GameState>(GameState.WAITING_ROOM);

	useEffect(
		() => {
			const sub = service.gameService.subject.subscribe((event) => {
				switch (event.type) {
					case GameEvents.GAME_STARTED:
						setState(GameState.PLAY);
						break;
					case GameEvents.GAME_STOPPED:
						setState(GameState.WAITING_ROOM);
						break;
				}
			});

			return (): void => {
				sub.unsubscribe();
			};
		},
		[ service.gameService ]
	);

	// If Game, it means, connection to peers are established
	return (
		<React.Fragment>
			<GameControl service={service.gameService} onExit={(): void => service.exitGame()} />
			{gameState === GameState.LOADING && <Loading />}
			{gameState === GameState.WAITING_ROOM && <WaitingRoom />}
			{gameState === GameState.PLAY && <Game />}
		</React.Fragment>
	);
};

const Loading = () => <div>Please Wait, its loading</div>;
