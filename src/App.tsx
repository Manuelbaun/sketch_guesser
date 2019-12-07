import React from 'react';
import Canvas from './components/drawing/canvas';
import MessageBox from './components/messages/messageBox';
import CountDown from './components/countDown/countDown';
import P2PGraphEngine from './components/menu/p2pGraph.engine';
import MessageEngine from './engine/message.engine';
import DrawEngine from './engine/draw.engine';
import GameEngine, { GameStates } from './engine/game.engine';

import './service/yjs.playground';

import PeerManager2 from './service/communication/peer_manager';
import { DataTypes } from './service/communication/communication.type';

import './App.css';
import Menu from './components/menu/menu';

var chance = require('chance')();
const name = chance.name();

const peerManager: PeerManager2 = new PeerManager2({
	debug: 2,
	host: '192.168.178.149',
	port: 9000
});

peerManager.subscribeToDataStream({
	next: (data) => {
		switch (data.type) {
			case DataTypes.DRAW:
				drawingEngine.applyUpdate(data.payload);
				break;
			case DataTypes.GAME:
				gameEngine.applyUpdate(data.payload);
				break;
			case DataTypes.MESSAGE:
				messageEngine.applyUpdate(data.payload);
				break;
			default:
				console.error('Unsupported Transmitting Type:' + data.type);
		}
	}
});

const gameEngine = new GameEngine();
const drawingEngine = new DrawEngine();
const messageEngine = new MessageEngine(name);
const p2pGraphEngine = new P2PGraphEngine(peerManager.connectionStream);

const App: React.FC = () => {
	gameEngine.onUpdate = (update) => peerManager.send(update);
	drawingEngine.onUpdate = (update) => peerManager.send(update);
	messageEngine.onUpdate = (update) => peerManager.send(update);

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
			<Menu onStartGame={startGame} p2pGraphEngine={p2pGraphEngine} />
			<div className="App">
				<CountDown gameEngine={gameEngine} />
				<Canvas drawingEngine={drawingEngine} />
				<MessageBox messageService={messageEngine} localUserName={name} />
			</div>
		</React.Fragment>
	);
};

export default App;
