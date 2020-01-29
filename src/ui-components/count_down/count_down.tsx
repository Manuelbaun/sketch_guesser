import React, { useState, useEffect } from 'react';
import { GameService, GameEvents } from '../../components/game';

import './count_down.css';
interface Props {
	service: GameService;
}

export const CountDown: React.FC<Props> = ({ service }) => {
	const [ time, setTime ] = useState(service.time);
	const [ currentRound, setCurrentRound ] = useState(service.round);

	useEffect(
		() => {
			const sub = service.subject.subscribe((event) => {
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
		[ service ]
	);

	return (
		<div className="game-info">
			<span className="count-down"> "{time}"</span>;
			<span className="current-round"> "{currentRound}/</span>
			<span className="rounds">{service.roundsPerGame}" </span>
		</div>
	);
};
