import React, { useState, useEffect } from 'react';
import DrawingArea from './components/drawingArea/drawingArea';
import MessageBox from './components/messages/messageBox';
import CountDown from './components/countDown/countDown';
import MessageEngine from './components/messages/message.engine';
import DrawEngine from './components/drawingArea/draw.engine';
import GameEngine from './gameEngine/game.engine';
import Menu from './components/menu/menu';
import CommunicationServiceImpl from './service/communication/communication.service';
import CacheEngine from './gameEngine/cache.engine';
import { GameEngineEvents } from './gameEngine/game.types';
import PlayerEngine from './gameEngine/player.engine';

import './App.css';

var chance = require('chance')();
const name = chance.name();

// establish connection between peers
const commService = new CommunicationServiceImpl();

// setup the cache via yjs and creates the doc.
const cache = new CacheEngine(commService);

// setup the "engines" need proper names and refactor
const playerEngine = new PlayerEngine(cache, commService);
const gameEngine = new GameEngine(cache);
const drawingEngine = new DrawEngine(cache);
const messageEngine = new MessageEngine(name, cache);

const App: React.FC = () => {
	const [ gameStarted, setGameStarted ] = useState(false);

	const startGame = () => setGameStarted(true);
	const stopGame = () => setGameStarted(false);

	useEffect(() => {
		gameEngine.on(GameEngineEvents.GAME_STARTED, startGame);
		gameEngine.on(GameEngineEvents.GAME_STOPPED, stopGame);

		return () => {
			gameEngine.off(GameEngineEvents.GAME_STARTED, startGame);
			gameEngine.off(GameEngineEvents.GAME_STOPPED, stopGame);
		};
	}, []);

	return (
		<React.Fragment>
			<Menu gameEngine={gameEngine} comm={commService} playerEngine={playerEngine} />
			<div className="App">
				{/* Hack around */}
				{gameStarted && <CountDown gameEngine={gameEngine} />}
				<DrawingArea drawingEngine={drawingEngine} />
				<MessageBox messageService={messageEngine} localUserName={name} />
			</div>
		</React.Fragment>
	);
};

export default App;
