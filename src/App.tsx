import React, { useState, useEffect } from 'react';
import { GameEngine, PlayerEngine } from './gameEngine';
import { GameEvents } from './models';
import { CacheStore, PersistentStore, CommunicationServiceImpl, EventBus } from './service';
import { DrawingManager, MessageEngine, Menu, CountDown, MessageBox, DrawingArea } from './components';

import './App.css';
// TODO: hen tap updates, no reconnect???

// Typedef
type FunctionVoidCallback = () => void;

// Setups
const eventBus = new EventBus();

// setup the cache via yjs and creates the doc.
const cache = new CacheStore();

// establish connection between peers
const commService = new CommunicationServiceImpl(cache, eventBus);

// setup the "engines" need proper names and refactor
const playerEngine = new PlayerEngine(cache, eventBus);
const gameEngine = new GameEngine(cache);
const drawingEngine = new DrawingManager(cache);
const messageEngine = new MessageEngine(cache);

const providerValue = {
	localID: PersistentStore.localID,
	cache,
	playerEngine,
	gameEngine,
	drawingEngine,
	messageEngine
};

// needs to use this => better
const AppContext = React.createContext(providerValue);

const App: React.FC = () => {
	const [ gameStarted, setGameStarted ] = useState(false);

	useEffect(() => {
		const startGame: FunctionVoidCallback = () => setGameStarted(true);
		const stopGame: FunctionVoidCallback = () => setGameStarted(false);

		gameEngine.on(GameEvents.GAME_STARTED, startGame);
		gameEngine.on(GameEvents.GAME_STOPPED, stopGame);

		return (): void => {
			gameEngine.off(GameEvents.GAME_STARTED, startGame);
			gameEngine.off(GameEvents.GAME_STOPPED, stopGame);
		};
	}, []);

	return (
		<AppContext.Provider value={providerValue}>
			<div className="App">
				<div className="App-Container">
					<div className="App-Setting">
						<Menu gameEngine={gameEngine} playerEngine={playerEngine} />
					</div>

					<div className="App-Message">
						{gameStarted && <CountDown gameEngine={gameEngine} />}
						<MessageBox messageEngine={messageEngine} />
					</div>

					<div className="App-Drawing">
						<DrawingArea drawingManager={drawingEngine} width={1000} height={1000} />
					</div>
				</div>
			</div>
		</AppContext.Provider>
	);
};

export default App;
