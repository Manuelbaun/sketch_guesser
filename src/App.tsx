import React, { useState, useEffect } from 'react';
import DrawingArea from './components/drawingArea/drawingArea';
import MessageBox from './components/messages/messageBox';
import CountDown from './components/countDown/countDown';
import MessageEngine from './components/messages/message.engine';
import DrawEngine from './components/drawingArea/draw.engine';
import { GameEngine, CacheEngine, PlayerEngine } from './gameEngine';
import Menu from './components/menu/menu';

import { GameEvents } from './models';

import './App.css';
import { CommunicationServiceImpl } from './service/communication';
import { EventBus } from './service/event.bus';

const eventBus = new EventBus();

// setup the cache via yjs and creates the doc.
const cache = new CacheEngine();
// establish connection between peers
const commService = new CommunicationServiceImpl(cache, eventBus);

// setup the "engines" need proper names and refactor
const playerEngine = new PlayerEngine(cache, commService, eventBus);
const gameEngine = new GameEngine(cache);
const drawingEngine = new DrawEngine(cache);
const messageEngine = new MessageEngine(cache, playerEngine);

const App: React.FC = () => {
	const [ gameStarted, setGameStarted ] = useState(false);

	const startGame = () => setGameStarted(true);
	const stopGame = () => setGameStarted(false);

	useEffect(() => {
		gameEngine.on(GameEvents.GAME_STARTED, startGame);
		gameEngine.on(GameEvents.GAME_STOPPED, stopGame);

		return () => {
			gameEngine.off(GameEvents.GAME_STARTED, startGame);
			gameEngine.off(GameEvents.GAME_STOPPED, stopGame);
		};
	}, []);

	return (
		<div className="App">
			<div className="App-Container">
				<div className="App-Header" />
				<div className="App-Setting">
					<Menu gameEngine={gameEngine} comm={commService} playerEngine={playerEngine} />
				</div>

				<div className="App-Message">
					{gameStarted && <CountDown gameEngine={gameEngine} />}
					<MessageBox messageEngine={messageEngine} />
				</div>

				<div className="App-Drawing">
					<DrawingArea drawingEngine={drawingEngine} />
				</div>
			</div>
		</div>
	);
};

export default App;
