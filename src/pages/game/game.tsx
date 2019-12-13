import React from 'react';
import { GameControl, CountDown, MessageBox, DrawingArea, MessageEngine, DrawingManager } from '../../components';
import { GameEngine } from '../../gameEngine';
import { CacheStore } from '../../service';

type Props = {
	gameEngine: GameEngine;
	cache: CacheStore
};

export const GamePage = ({ gameEngine, cache }: Props) => {
	const drawingManager = new DrawingManager(cache);
	const messageEngine = new MessageEngine(cache);
	return (
		<div>
			<div className="App-Message">
				<GameControl gameEngine={gameEngine} />
				<CountDown gameEngine={gameEngine} />
				<MessageBox messageEngine={messageEngine} />
			</div>

			<div className="App-Drawing">
				<DrawingArea drawingManager={drawingManager} width={1000} height={500} />
			</div>
		</div>
	);
};
