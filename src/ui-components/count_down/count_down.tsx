import React, { useState, useEffect } from 'react';
import { GameEngineInterface } from '../../engines';
import { GameEvents } from '../../models';

import './count_down.css';

interface CountDownProps {
	gameEngine: GameEngineInterface;
}

export const CountDown: React.FC<CountDownProps> = ({ gameEngine }) => {
	const [ time, setTime ] = useState(gameEngine.time);
	const [ currentRound, setCurrentRound ] = useState(gameEngine.round);

	useEffect(
		() => {
			const sub = gameEngine.subscribe((event) => {
				if (event.type === GameEvents.CLOCK_UPDATE) {
					setTime(event.value);
				} else if (event.type === GameEvents.ROUND_CHANGE) {
					setCurrentRound(event.value);
				}
			});

			return () => {
				sub.unsubscribe();
			};
		},
		[ gameEngine ]
	);

	return (
		<div className="game-info">
			<span className="count-down"> "{time}"</span>;
			<span className="current-round"> "{currentRound}/</span>
			<span className="rounds">{gameEngine.roundsPerGame}" </span>
		</div>
	);
};