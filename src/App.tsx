import React, { useState, useEffect, useContext } from 'react';
import { LandingScene, GameScene } from './scenes';
import './App.css';
import { AppService, AppEventType } from './service';

type AppProps = {
	service: AppService;
};

const service = new AppService();

export const AppContext = React.createContext<AppProps>({
	service
});

const AppWrapper: React.FC = () => {
	return (
		<AppContext.Provider value={{ service }}>
			<App />;
		</AppContext.Provider>
	);
};

enum AppStates {
	GAME,
	MENU
}

const App: React.FC = () => {
	const { service } = useContext(AppContext);
	const [ appState, setAppState ] = useState<AppStates>(AppStates.MENU);

	useEffect(
		() => {
			service.subject.subscribe((event) => {
				if (event.type === AppEventType.GAME_START) {
					// set URL
					const url = window.location.origin + '/' + event.value;
					window.history.replaceState('', 'Room', url);
					setAppState(AppStates.GAME);
				} else {
					window.history.replaceState('', 'Room', '');
					setAppState(AppStates.MENU);
				}
			});
		},
		[ service ]
	);

	return (
		<div className="App">
			{appState === AppStates.MENU && <LandingScene key="landing-scene" />}
			{appState === AppStates.GAME && <GameScene key="game-scene" />}
		</div>
	);
};

export default AppWrapper;
