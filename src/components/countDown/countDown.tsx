import React, { useState, useEffect } from 'react';
import GameEngine from '../../engine/game.engine';

import './countDown.css';
import { GameEngineEvents } from '../../engine/game.types';

interface CountDownInterface {
	gameEngine: GameEngine;
}

const CountDown: React.FC<CountDownInterface> = ({ gameEngine }) => {
	const [ time, setTime ] = useState(gameEngine.time);
	const [ rounds, setRounds ] = useState(gameEngine.rounds);
	const [ currentRound, setCurrentRound ] = useState(gameEngine.currentRound);

	useEffect(() => {
		const updateTime = (time) => setTime(time);
		const updateRound = (round) => setCurrentRound(round);
		gameEngine.on(GameEngineEvents.CLOCK_UPDATE, updateTime);
		gameEngine.on(GameEngineEvents.ROUND_CHANGE, updateRound);

		return () => {
			gameEngine.off(GameEngineEvents.CLOCK_UPDATE, updateTime);
			gameEngine.off(GameEngineEvents.ROUND_CHANGE, updateRound);
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

export default CountDown;
