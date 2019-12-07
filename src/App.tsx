import React from 'react';
import Canvas from './components/drawing/canvas';
import MessageBox from './components/messages/messageBox';
import CountDown from './components/countDown/countDown';
import MessageEngine from './engine/message.engine';
import DrawEngine from './engine/draw.engine';
import GameEngine, { GameStates } from './engine/game.engine';

import './service/yjs.playground';

import './App.css';
import Menu from './components/menu/menu';
import CommunicationServiceImpl from './service/communication/communication.service';
import CacheEngine from './engine/cache.engine';

var chance = require('chance')();
const name = chance.name();

// establish connection between peers
const commService = new CommunicationServiceImpl();
// setup the cache via yjs and creates the doc.
const cache = new CacheEngine(commService);

const gameEngine = new GameEngine(cache);
const drawingEngine = new DrawEngine(cache);
const messageEngine = new MessageEngine(name, cache);

const App: React.FC = () => {
	const startGame = () => {
		gameEngine.guessWord = 'test';
		gameEngine.startGame({
			codeWordHash: '',
			currentRound: 1,
			rounds: 3,
			currentMasterID: '',
			state: GameStates.WAITING
		});
	};

	console.log('---------Render App-------------');

	return (
		<React.Fragment>
			<div>
				<Menu onStartGame={startGame} comm={commService} />
			</div>
			<div className="App">
				<CountDown gameEngine={gameEngine} />
				<Canvas drawingEngine={drawingEngine} />
				<MessageBox messageService={messageEngine} localUserName={name} />
			</div>
		</React.Fragment>
	);
};

export default App;
