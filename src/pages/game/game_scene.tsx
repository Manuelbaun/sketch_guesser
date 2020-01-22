import React from 'react';
import { EventBus, CacheStoreInterface, CommunicationService, CacheStore } from '../../service';
import { PlayerEngineInterface, GameEngineInterface, PlayerEngine, GameEngine } from '../../engines';
import { GameEvents } from '../../models';
import { GameControl } from '../../components';
import { WaitingRoom } from './waiting_room';
import { Game } from './game';

type TheGameProps = {
	roomName;
	onLeaveGame: Function;
};

type TheGameState = {
	gameState: GameState;
};

enum GameState {
	WAITING_ROOM,
	PLAY,
	LOADING
}

export class GameScene extends React.Component<TheGameProps, TheGameState> {
	eventBus: EventBus;
	cacheStore: CacheStoreInterface;
	playerEngine: PlayerEngineInterface;
	gameEngine: GameEngineInterface;
	commService: CommunicationService;

	constructor(props: TheGameProps) {
		super(props);

		this.state = {
			gameState: GameState.LOADING
		};
	}

	componentDidMount() {
		this.setState({ gameState: GameState.WAITING_ROOM });
	}

	startGame;
	stopGame;
	componentWillMount() {
		this.eventBus = new EventBus();
		this.cacheStore = new CacheStore();
		this.playerEngine = new PlayerEngine(this.cacheStore, this.eventBus);
		this.gameEngine = new GameEngine(this.cacheStore);
		this.commService = new CommunicationService(this.cacheStore, this.eventBus, this.props.roomName);

		// need to assign it, because of the scope
		this.startGame = () => this.setState({ gameState: GameState.PLAY });
		this.stopGame = () => this.setState({ gameState: GameState.WAITING_ROOM });

		this.gameEngine.on(GameEvents.GAME_STARTED, this.startGame);
		this.gameEngine.on(GameEvents.GAME_STOPPED, this.stopGame);
	}

	componentWillUnmount() {
		// unsubscribe
		this.gameEngine.off(GameEvents.GAME_STARTED, this.startGame);
		this.gameEngine.off(GameEvents.GAME_STOPPED, this.stopGame);

		// dispose all
		this.commService.dispose();
		this.playerEngine.dispose();
		this.gameEngine.dispose();
		this.cacheStore.dispose();
		this.eventBus.dispose();
	}

	render() {
		const { onLeaveGame } = this.props;
		const { gameState } = this.state;

		if (gameState == GameState.LOADING) {
			return <div>Please Wait</div>;
		}

		// If Game, it means, connection to peers are established
		return (
			<React.Fragment>
				<GameControl gameEngine={this.gameEngine} goBackToMenu={onLeaveGame} />
				{gameState == GameState.WAITING_ROOM && <WaitingRoom playerEngine={this.playerEngine} />}
				{gameState == GameState.PLAY && <Game gameEngine={this.gameEngine} store={this.cacheStore} />}
			</React.Fragment>
		);
	}
}
