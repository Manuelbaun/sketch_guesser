import React, { useState, useEffect } from 'react';
import { GameEngine, PlayerEngine } from './engines';
import { GameEvents } from './models';
import { CacheStore, CommunicationService, EventBus } from './service';

import { LandingPage, RoomPage, GamePage } from './pages';

import './App.css';
import { GameControl } from './components';

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
let commService: CommunicationService;

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
	const joinGame = async (roomName?: string) => {
		// establish connection between peers
		if (commService) {
			// needs to clear the webrtc connections to all previous ones.
			// then reconnect, so the sync algorithm works properly
			// Update: still a bug
			await commService.dispose();
		}

		commService = new CommunicationService(cacheStore, eventBus, roomName);
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
			{appState != AppState.LANDING && (
				<div>
					<GameControl gameEngine={gameEngine} />
					{appState == AppState.ROOM && <RoomPage gameEngine={gameEngine} playerEngine={playerEngine} />}

					{appState == AppState.GAME && <GamePage gameEngine={gameEngine} store={cacheStore} />}
				</div>
			)}
		</div>
	);
};

export default App;
