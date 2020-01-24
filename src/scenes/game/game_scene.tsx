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
	syncing: boolean;
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
			gameState: GameState.LOADING,
			syncing: true
		};
	}

	componentDidMount() {
		this.setState({ gameState: GameState.WAITING_ROOM });
	}

	startGame;
	stopGame;
	UNSAFE_componentWillMount() {
		this.eventBus = new EventBus();
		this.cacheStore = new CacheStore();
		this.playerEngine = new PlayerEngine(this.cacheStore, this.eventBus);
		this.gameEngine = new GameEngine(this.cacheStore);
		this.commService = new CommunicationService(this.cacheStore, this.eventBus, this.props.roomName);

		this.eventBus.on('SYNCED', (data) => {
			this.setState({ gameState: GameState.WAITING_ROOM });
			if (data.synced) {
				this.setState({ syncing: false });
			}
		});

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

		let scene;

		// convert from string to number
		switch (+gameState) {
			case GameState.LOADING:
				scene = <div>Please Wait</div>;
				break;
			case GameState.WAITING_ROOM:
				scene = <WaitingRoom playerEngine={this.playerEngine} />;
				break;
			case GameState.PLAY:
				scene = <Game gameEngine={this.gameEngine} store={this.cacheStore} />;
				break;
			default:
				scene = <div>Unknown State</div>;
		}
		// If Game, it means, connection to peers are established
		return (
			<React.Fragment>
				<GameControl gameEngine={this.gameEngine} goBackToMenu={onLeaveGame} />
				{scene}
			</React.Fragment>
		);
	}
}
