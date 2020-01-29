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
	service.subject.subscribe((event) => console.log(event));

	return (
		<AppContext.Provider value={{ service }}>
			<App />;
		</AppContext.Provider>
	);
};

const App: React.FC = () => {
	const { service } = useContext(AppContext);
	const [ appState, setAppState ] = useState<AppEventType>(AppEventType.GAME_END);

	useEffect(
		() => {
			service.subject.subscribe((event) => {
				if (event.type === AppEventType.GAME_START) {
					// set URL
					const url = window.location.origin + '/' + event.value;
					window.history.replaceState('', 'Room', url);
				}

				setAppState(event.type);
			});
		},
		[ service ]
	);

	let scene;

	switch (appState) {
		case AppEventType.GAME_END:
			scene = <LandingScene key="landing-scene" />;
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
