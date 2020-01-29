import React, { useState, useEffect } from 'react';
import { LandingScene, GameScene } from './scenes';
import './App.css';
import { AppService, AppEventType } from './service';

const AppWrapper: React.FC = () => {
	const appService = new AppService();
	return <App service={appService} />;
};

type AppProps = {
	service: AppService;
};

const App: React.FC<AppProps> = ({ service }) => {
	const [ appState, setAppState ] = useState<AppEventType>(AppEventType.GAME_END);
	const [ roomName, setRoomName ] = useState<string>('');

	useEffect(
		() => {
			service.subject.subscribe((event) => {
				if (event.type === AppEventType.GAME_START) {
					// set URL
					const url = window.location.origin + '/' + event.value;
					window.history.replaceState('', 'Room', url);
				}
				console.log(event);
				setAppState(event.type);
				setRoomName(event.value);
			});
		},
		[ service ]
	);

	let scene;

	switch (appState) {
		case AppEventType.GAME_END:
			scene = <LandingScene key="landing-scene" service={service} />;
			break;
		case AppEventType.GAME_START:
			scene = <GameScene key="game-scene" service={service} />;
			break;
		default:
			scene = <div>Error, this should never happen. State unknown</div>;
	}

	return <div className="App">{scene}</div>;
};

export default AppWrapper;
