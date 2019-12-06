import React, { useState } from 'react';

import './countDown.css';
import GameEngine from '../../engine/game.engine';

interface CountDownInterface {
	gameEngine: GameEngine;
}

const CountDown: React.FC<CountDownInterface> = ({ gameEngine }) => {
	const [ time, setTime ] = useState(gameEngine.clock.get('time'));

	gameEngine.clock.observe((event) => {
		const _time = gameEngine.clock.get('time');
		setTime(_time);
	});

	return <div className="count-down"> {time}</div>;
};

export default CountDown;
