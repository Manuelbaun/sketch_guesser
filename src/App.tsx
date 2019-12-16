import React, { useState, useEffect } from 'react';
import { GameEngine, PlayerEngine } from './gameEngine';
import { GameEvents } from './models';
import { CacheStore, PersistentStore, CommunicationServiceImpl, EventBus } from './service';

import { LandingPage, RoomPage, GamePage } from './pages';

import './App.css';


// Typedef
type FunctionVoidCallback = () => void;

// Setups
const eventBus = new EventBus();
// setup the cache via yjs and creates the doc.
const cache = new CacheStore();

// setup the "engines" need proper names and refactor
const playerEngine = new PlayerEngine(cache, eventBus);
const gameEngine = new GameEngine(cache);

const providerValue = {
	localID: PersistentStore.localID,
	cache,
	playerEngine,
	gameEngine
};

// needs to use this => better
const AppContext = React.createContext(providerValue);

type AppState = 'LANDING' | 'ROOM' | 'GAME';

// needs to be refactored
let commService: CommunicationServiceImpl;

const App: React.FC = () => {
	const [ appState, setAppState ] = useState<AppState>('LANDING');

	const startGame: FunctionVoidCallback = () => {
		console.log('Start the game');
		setAppState('GAME');
	};
	const stopGame: FunctionVoidCallback = () => {
		console.log('STOP the game');
		setAppState('ROOM');
	};

	useEffect(() => {
		const roomID = window.location.pathname.slice(1);
		if (roomID != '') {
			joinGame(roomID);
		}

		gameEngine.on(GameEvents.GAME_STARTED, startGame);
		gameEngine.on(GameEvents.GAME_STOPPED, stopGame);

		return (): void => {
			gameEngine.off(GameEvents.GAME_STARTED, startGame);
			gameEngine.off(GameEvents.GAME_STOPPED, stopGame);
		};
	}, []);

	// the same as open a room by id
	const joinGame = (id?: string) => {
		// establish connection between peers
		commService = new CommunicationServiceImpl(cache, eventBus, id);

		const url = window.location.origin + '/' + commService.roomID;
		window.history.replaceState('', 'Room', url);
		setAppState('ROOM');
	};

	const createGame = () => {
		joinGame();
	};

	return (
		<AppContext.Provider value={providerValue}>
			<div className="App">
				{appState == 'LANDING' && <LandingPage onJoinGame={joinGame} onCreateGame={createGame} />}

				{appState == 'ROOM' && <RoomPage gameEngine={gameEngine} playerEngine={playerEngine} />}

				{appState == 'GAME' && <GamePage gameEngine={gameEngine} cache={cache} />}
			</div>
		</AppContext.Provider>
	);
};

export default App;
