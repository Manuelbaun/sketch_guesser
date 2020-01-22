import React, { useState } from 'react';

import { LandingScene, GameScene } from './pages';

import './App.css';

enum AppState {
	MENU,
	GAME
}

const App: React.FC = () => {
	const [ appState, setAppState ] = useState<AppState>(AppState.MENU);
	const [ roomName, setRoomName ] = useState<string>('');

	let services: any = {};

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

	return (
		<div className="App">
			{appState == AppState.MENU && <LandingScene onJoinGame={startGame} onCreateGame={startGame} />}
			{appState == AppState.GAME && <GameScene roomName={roomName} onLeaveGame={leaveGame} />}
		</div>
	);
};

export default App;
