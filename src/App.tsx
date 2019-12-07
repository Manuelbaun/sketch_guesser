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
import StorageEngine from './engine/storage.engine';

var chance = require('chance')();
const name = chance.name();

const commService = new CommunicationServiceImpl();
const store = new StorageEngine(commService);

const gameEngine = new GameEngine(commService);
const drawingEngine = new DrawEngine(commService);
const messageEngine = new MessageEngine(name, commService, store);

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
			<Menu onStartGame={startGame} comm={commService} />
			<div className="App">
				<CountDown gameEngine={gameEngine} />
				<Canvas drawingEngine={drawingEngine} />
				<MessageBox messageService={messageEngine} localUserName={name} />
			</div>
		</React.Fragment>
	);
};

export default App;
