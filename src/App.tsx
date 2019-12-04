import React from 'react';
import Canvas from './components/drawing/canvas';
import MessageBox from './components/messages/messageBox';
import Message from './components/models/message';
import './App.css';
import State from './service/state';

import sha256 from 'sha256';
import GameEngine from './service/gameEngine';
import MessageService from './service/message.service';

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
	const state = new State();
	const gameEngine = new GameEngine(state.gameState);
	const messageService = new MessageService(state.messageState, 'Hans');

	
	state.messageState.push(msg);

	gameEngine.createGame({
		clock: 60,
		codeWord: '',
		codeWordHash: '',
		currentRound: 1,
		rounds: 3,
		players: 5
	});

	gameEngine.setWord('test');

	return (
		<div className="App">
			{/* <header className="App-header">
      </header> */}
			<Canvas />
			<MessageBox messageService={messageService} localUserName={'Hans'} />
		</div>
	);
};

export default App;
