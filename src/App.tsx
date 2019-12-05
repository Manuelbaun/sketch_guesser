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
	const state = new Store();
	const gameEngine = new GameEngine(state);
	const messageService = new MessageService(state.messageState, 'Hans');

	const [ fullScreen, setFullScreen ] = useState(false);

	state.messageState.push(msg);

	gameEngine.createGame({
		codeWord: '',
		codeWordHash: '',
		currentRound: 1,
		rounds: 3,
		players: 5
	});

	gameEngine.setGuessWord('test');
	gameEngine.startRound();
	return (
		<div className="App">
			<button onClick={() => setFullScreen(true)}>Go Fullscreen</button>

			<Fullscreen enabled={fullScreen} onChange={(isFull) => setFullScreen(isFull)}>
				<CountDown gameEngine={gameEngine} />

				<Canvas />
				<MessageBox messageService={messageService} localUserName={'Hans'} />
			</Fullscreen>
		</div>
	);
};

export default App;
