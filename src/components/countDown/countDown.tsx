import React, { useState, useEffect } from 'react';
import { GameEngine } from '../../gameEngine';
import { GameEvents } from '../../models';

import './countDown.css';

interface CountDownProps {
	gameEngine: GameEngine;
}

export const CountDown: React.FC<CountDownProps> = ({ gameEngine }) => {
	const [ time, setTime ] = useState(gameEngine.time);
	const [ rounds, setRounds ] = useState(gameEngine.rounds);
	const [ currentRound, setCurrentRound ] = useState(gameEngine.currentRound);

	useEffect(() => {
		const updateTime = (time) => setTime(time);
		const updateRound = (round) => setCurrentRound(round);
		gameEngine.on(GameEvents.CLOCK_UPDATE, updateTime);
		gameEngine.on(GameEvents.ROUND_CHANGE, updateRound);

		return () => {
			gameEngine.off(GameEvents.CLOCK_UPDATE, updateTime);
			gameEngine.off(GameEvents.ROUND_CHANGE, updateRound);
		};
	}, []);

	return (
		<div className="game-info">
			<span className="count-down"> "{time}"</span>;
			<span className="current-round"> "{currentRound}/</span>
			<span className="rounds">{rounds}" </span>
		</div>
	);
};
