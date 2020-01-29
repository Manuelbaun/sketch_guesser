import React, { useState } from 'react';
import { LandingScene, GameScene } from './scenes';
import './App.css';
// import ulog from 'ulog';
// ulog.level = process.env.NODE_ENV === 'development' ? ulog.DEBUG : ulog.INFO;

// set the y-js logger active
if (process.env.NODE_ENV === 'development') {
	// localStorage.setItem('log', 'true');
}

enum AppState {
	MENU,
	GAME
}

const App: React.FC = () => {
	const [ appState, setAppState ] = useState<AppState>(AppState.MENU);
	const [ roomName, setRoomName ] = useState<string>('');

	const startGame = (_roomName = '') => {
		// set URL
		const url = window.location.origin + '/' + _roomName;
		window.history.replaceState('', 'Room', url);

		setRoomName(_roomName);
		setAppState(AppState.GAME);
	};

	const exitGame = (): void => {
		setRoomName('');
		setAppState(AppState.MENU);
	};

	let scene;

	switch (appState) {
		case AppState.MENU:
			scene = <LandingScene key="landing-scene" onJoinGame={startGame} onCreateGame={startGame} />;
			break;
		case AppState.GAME:
			scene = <GameScene key="game-scene" roomName={roomName} onExitGame={exitGame} />;
			break;
		default:
			scene = <div>Error, this should never happen. State unknown</div>;
	}

	return <div className="App">{scene}</div>;
};

export default App;
