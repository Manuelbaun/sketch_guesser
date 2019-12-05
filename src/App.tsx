import React, { useState, useCallback } from 'react';
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

import NetfluxTest from './service/netflux';
var chance = require('chance')();

let net: NetfluxTest;

const App: React.FC = () => {
	const store = new Store();
	const messageService = new MessageService(store.messageState, 'Hans');
	const gameEngine = new GameEngine(store);
	const drawingEngine = new DrawEngine({ store: store.drawState });

	const [ fullScreen, setFullScreen ] = useState(false);

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
	const name = chance.name();

	const joinGame = useCallback((gameID: string) => {
		console.log('GameID', gameID);
		net = new NetfluxTest({
			name: name,
			groupId: gameID,
			onDataReceived: (data) => {
				if (typeof data === 'string') {
					console.log(data);
				} else {
					
					store.onIncomingUpdate(data); // Uint8Array
				}
			}
		});
		store.onDataSend = (data) => {
			net.send(data);
			console.log('send outside');
		};
	}, []);

	joinGame('hans');

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
