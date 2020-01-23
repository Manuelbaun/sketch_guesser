import React, { useState, useEffect } from 'react';
import { GameEngineInterface } from '../../engines';
import { GameEvents } from '../../models';

import './count_down.css';

interface CountDownProps {
	gameEngine: GameEngineInterface;
}

export const CountDown: React.FC<CountDownProps> = ({ gameEngine }) => {
	const [ time, setTime ] = useState(gameEngine.time);
	const [ currentRound, setCurrentRound ] = useState(gameEngine.currentRound);

	useEffect(
		() => {
			const updateTime = (time) => setTime(time);
			const updateRound = (round) => setCurrentRound(round);
			gameEngine.on(GameEvents.CLOCK_UPDATE, updateTime);
			gameEngine.on(GameEvents.ROUND_CHANGE, updateRound);

			return () => {
				gameEngine.off(GameEvents.CLOCK_UPDATE, updateTime);
				gameEngine.off(GameEvents.ROUND_CHANGE, updateRound);
			};
		},
		[ gameEngine ]
	);

	return (
		<div className="game-info">
			<span className="count-down"> "{time}"</span>;
			<span className="current-round"> "{currentRound}/</span>
			<span className="rounds">{gameEngine.rounds}" </span>
		</div>
	);
};
