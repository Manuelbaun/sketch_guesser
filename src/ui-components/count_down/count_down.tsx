import React, { useState, useEffect, useContext } from 'react';
import { GameService, GameEvents } from '../../components/game';

import './count_down.css';
import { AppContext } from '../../App';

export const CountDown: React.FC = (props) => {
	const { service: { gameService } } = useContext(AppContext);

	const [ time, setTime ] = useState(gameService.time);
	const [ currentRound, setCurrentRound ] = useState(gameService.round);

	useEffect(
		() => {
			const sub = gameService.subject.subscribe((event) => {
				if (event.type === GameEvents.CLOCK_UPDATE) {
					setTime(event.value);
				} else if (event.type === GameEvents.ROUND_CHANGE) {
					setCurrentRound(event.value);
				}
			});

			return (): void => {
				sub.unsubscribe();
			};
		},
		[ gameService ]
	);

	return (
		<div className="game-info">
			<span className="count-down"> "{time}"</span>;
			<span className="current-round"> "{currentRound}/</span>
			<span className="rounds">{gameService.roundsPerGame}" </span>
		</div>
	);
};
