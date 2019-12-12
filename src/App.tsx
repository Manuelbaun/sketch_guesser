import React, { useState, useEffect } from 'react';
import DrawingArea from './components/drawingArea/drawingArea';
import MessageBox from './components/messages/messageBox';
import CountDown from './components/countDown/countDown';
import MessageEngine from './components/messages/message.engine';
import DrawEngine from './components/drawingArea/draw.engine';
import { GameEngine, PlayerEngine } from './gameEngine';
import Menu from './components/menu/menu';

import { GameEvents } from './models';

import './App.css';
import { CommunicationServiceImpl } from './service/communication';
import { EventBus } from './service/event.bus';
import { CacheStore, PersistentStore } from './service/storage';

const eventBus = new EventBus();

// setup the cache via yjs and creates the doc.
const cache = new CacheStore();
const persistance = new PersistentStore();
// establish connection between peers
const commService = new CommunicationServiceImpl(cache, eventBus);
// setup the "engines" need proper names and refactor
const playerEngine = new PlayerEngine(cache, commService, eventBus);
const gameEngine = new GameEngine(cache);
const drawingEngine = new DrawEngine(cache);
const messageEngine = new MessageEngine(cache, playerEngine);

type FunctionVoidCallback = () => void;

const App: React.FC = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const startGame: FunctionVoidCallback = () => setGameStarted(true);
    const stopGame: FunctionVoidCallback = () => setGameStarted(false);

    useEffect(() => {
        gameEngine.on(GameEvents.GAME_STARTED, startGame);
        gameEngine.on(GameEvents.GAME_STOPPED, stopGame);

        return (): void => {
            gameEngine.off(GameEvents.GAME_STARTED, startGame);
            gameEngine.off(GameEvents.GAME_STOPPED, stopGame);
        };
    }, []);

    return (
        <div className="App">
            <div className="App-Container">
                {/* <div className="App-Header" /> */}
                <div className="App-Setting">
                    <Menu gameEngine={gameEngine} comm={commService} playerEngine={playerEngine} />
                </div>

                <div className="App-Message">
                    {gameStarted && <CountDown gameEngine={gameEngine} />}
                    <MessageBox messageEngine={messageEngine} />
                </div>

                <div className="App-Drawing">
                    <DrawingArea drawingEngine={drawingEngine} width={1000} height={1000} />
                </div>
            </div>
        </div>
    );
};

export default App;
