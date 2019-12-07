import React, { useState, useEffect } from 'react';
import Canvas from './components/drawing/canvas';
import MessageBox from './components/messages/messageBox';
import CountDown from './components/countDown/countDown';
import MessageEngine from './components/messages/message.engine';
import DrawEngine from './components/drawing/draw.engine';
import GameEngine from './engine/game.engine';

import './service/yjs.playground';

import './App.css';
import Menu from './components/menu/menu';
import CommunicationServiceImpl from './service/communication/communication.service';
import CacheEngine from './engine/cache.engine';
import { GameEngineEvents } from './engine/game.types';
import PlayerEngine from './engine/player.engine';

var chance = require('chance')();
const name = chance.name();

// establish connection between peers
const commService = new CommunicationServiceImpl();
// setup the cache via yjs and creates the doc.
const cache = new CacheEngine(commService);
const playerEngine = new PlayerEngine(cache, commService);

// setup the engines
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
				<Canvas drawingEngine={drawingEngine} />
				<MessageBox messageService={messageEngine} localUserName={name} />
			</div>
		</React.Fragment>
	);
};

export default App;
