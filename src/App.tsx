import React, { useState, useEffect } from 'react';
import { GameEngine, PlayerEngine } from './engines';
import { GameEvents } from './models';
import { CacheStore, CommunicationServiceImpl, EventBus } from './service';

import { LandingPage, RoomPage, GamePage } from './pages';

import './App.css';

// Typedef
type FunctionVoidCallback = () => void;

// Setups
const eventBus = new EventBus();
// setup the cache via yjs and creates the doc.
const cacheStore = new CacheStore();
// setup the "engines" need proper names and refactor
const playerEngine = new PlayerEngine(cacheStore, eventBus);
const gameEngine = new GameEngine(cacheStore);

enum AppState {
	LANDING,
	ROOM,
	GAME
}

// needs to be refactored
let commService: CommunicationServiceImpl;

const App: React.FC = () => {
	const [ appState, setAppState ] = useState<AppState>(AppState.LANDING);

	useEffect(() => {
		const roomID = window.location.pathname.slice(1);
		if (roomID != '') {
			joinGame(roomID);
		}

		const startGame: FunctionVoidCallback = () => setAppState(AppState.GAME);
		const stopGame: FunctionVoidCallback = () => setAppState(AppState.ROOM);

		gameEngine.on(GameEvents.GAME_STARTED, startGame);
		gameEngine.on(GameEvents.GAME_STOPPED, stopGame);

		return (): void => {
			gameEngine.off(GameEvents.GAME_STARTED, startGame);
			gameEngine.off(GameEvents.GAME_STOPPED, stopGame);
		};
	}, []);

	// the same as open a room by id
	const joinGame = (roomName?: string) => {
		// establish connection between peers
		commService = new CommunicationServiceImpl(cacheStore, eventBus, roomName);
		const url = window.location.origin + '/' + commService.roomID;
		window.history.replaceState('', 'Room', url);
		setAppState(AppState.ROOM);
	};

	const createGame = () => {
		joinGame();
	};

	return (
		<div className="App">
			{appState == AppState.LANDING && <LandingPage onJoinGame={joinGame} onCreateGame={createGame} />}

			{appState == AppState.ROOM && <RoomPage gameEngine={gameEngine} playerEngine={playerEngine} />}

			{appState == AppState.GAME && <GamePage gameEngine={gameEngine} store={cacheStore} />}
		</div>
	);
};

export default App;
