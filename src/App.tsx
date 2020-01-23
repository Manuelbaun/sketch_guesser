import React, { useState } from 'react';
import { LandingScene, GameScene } from './scenes';
import './App.css';

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

	const leaveGame = () => {
		setRoomName('');
		setAppState(AppState.MENU);
	};

	let scene;

	switch (appState) {
		case AppState.MENU:
			scene = <LandingScene key="landing-scene" onJoinGame={startGame} onCreateGame={startGame} />;
			break;
		case AppState.GAME:
			scene = <GameScene key="game-scene" roomName={roomName} onLeaveGame={leaveGame} />;
			break;
		default:
			scene = <div>Error, this should never happen. State unknown</div>;
	}

	return <div className="App">{scene}</div>;
};

export default App;
