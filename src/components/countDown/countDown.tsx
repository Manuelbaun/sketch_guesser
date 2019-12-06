import React, { useState, useEffect } from 'react';
import GameEngine, { GameEngineEvents } from '../../engine/game.engine';

import './countDown.css';

interface CountDownInterface {
	gameEngine: GameEngine;
}

const CountDown: React.FC<CountDownInterface> = ({ gameEngine }) => {
	const [ time, setTime ] = useState(gameEngine.currentTime);

	useEffect(() => {
		const updateTime = (time) => setTime(time);
		gameEngine.on(GameEngineEvents.CLOCK, updateTime);
		return () => {
			gameEngine.off(GameEngineEvents.CLOCK, updateTime);
		};
	}, []);
	return <div className="count-down"> {time}</div>;
};

export default CountDown;
