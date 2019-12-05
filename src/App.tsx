import React, { useState } from 'react';
import Canvas from './components/drawing/canvas';
import MessageBox from './components/messages/messageBox';
import Message from './models/message';
import Fullscreen from 'react-full-screen';

import './App.css';
import Store from './service/store';

import sha256 from 'sha256';
import GameEngine from './service/gameEngine';
import MessageService from './service/message.service';
import CountDown from './components/countDown/countDown';
import DrawEngine from './components/drawing/drawEngine';

const msg: Array<Message> = [
	{
		time: new Date(),
		user: 'Benno',
		message: 'Hallo all ok'
	},
	{
		time: new Date(),
		user: 'Hans Klaus',
		message: 'Ein Llanger test sonst kok'
	},
	{
		time: new Date(),
		user: 'Franz',
		message: 'Hallo all ok'
	}
];

const App: React.FC = () => {
	const store = new Store();
	const messageService = new MessageService(store.messageState, 'Hans');

	const [ fullScreen, setFullScreen ] = useState(false);
	store.messageState.push(msg);


	const gameEngine = new GameEngine(store);
	const drawingEngine = new DrawEngine({ store: store.drawState });

	gameEngine.createGame({
		gameID: 'home',
		codeWord: '',
		codeWordHash: '',
		currentRound: 1,
		rounds: 3,
		currentMasterID: ''
	});

	gameEngine.setGuessWord('test');
	gameEngine.startRound();
	return (
		<div className="App">
			{/* <button onClick={() => setFullScreen(true)}>Go Fullscreen</button> */}

			<Fullscreen enabled={fullScreen} onChange={(isFull) => setFullScreen(isFull)}>
				<CountDown gameEngine={gameEngine} />

				<Canvas drawingEngine={drawingEngine} />
				<MessageBox messageService={messageService} localUserName={'Hans'} />
			</Fullscreen>
		</div>
	);
};

export default App;
