import React from 'react';
import Canvas from './components/drawing/canvas';
import MessageBox from './components/messages/messageBox';
import Fullscreen from 'react-full-screen';

import * as Y from 'yjs';
import GameEngine from './engine/game.engine';
import MessageEngine from './engine/message.engine';
import CountDown from './components/countDown/countDown';
import DrawEngine from './engine/draw.engine';

import './service/yjs.playground';

import './App.css';
import PeerManager from './service/peerManager';
import P2PGraph from './components/p2pGraph/p2pGraph';
import P2PGraphEngine from './components/p2pGraph/p2pGraph.engine';
import { DocUpdateTypes } from './interfaces/engine.interface';

var chance = require('chance')();
const name = chance.name();

const gameEngine = new GameEngine();
const drawingEngine = new DrawEngine();
const messageEngine = new MessageEngine(name);
const p2pGraphEngine = new P2PGraphEngine();

const peer = new PeerManager(
	'',
	{
		debug: 2,
		host: '192.168.178.149',
		port: 9000
	},
	p2pGraphEngine,
	{
		onCurrentStateRequest: (peer) => {},
		onDataReceived: (update) => {
			switch (update.type) {
				case DocUpdateTypes.DRAW:
					drawingEngine.applyUpdate(update);
					break;
				case DocUpdateTypes.GAME:
					gameEngine.applyUpdate(update);
					break;
				case DocUpdateTypes.MESSAGE:
					messageEngine.applyUpdate(update);
					break;
				default:
					console.error('Unsupported Transmitting Type:' + update.type);
			}
		}
	}
);

const App: React.FC = () => {
	gameEngine.onUpdate = (update) => peer.broadcast(update);
	drawingEngine.onUpdate = (update) => peer.broadcast(update);
	messageEngine.onUpdate = (update) => peer.broadcast(update);

	setTimeout(() => {
		gameEngine.setGameProps({
			gameID: 'home',
			codeWordHash: '',
			currentRound: 1,
			rounds: 3,
			currentMasterID: ''
		});
	}, 2000);

	gameEngine.guessWord = 'test';
	gameEngine.startRound();

	console.log('---------Render App-------------');

	return (
		<div className="App">
			<CountDown gameEngine={gameEngine} />
			<Canvas drawingEngine={drawingEngine} />
			<MessageBox messageService={messageEngine} localUserName={name} />

			<P2PGraph engine={p2pGraphEngine} />
		</div>
	);
};

export default App;
