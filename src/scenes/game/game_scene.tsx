import React from 'react';
import { Subscription } from 'rxjs';
import { EventBus, CacheStoreInterface, CommunicationService, CacheStore, PersistentStore } from '../../service';

import { GameControl, DrawingManager } from '../../ui-components';
import { WaitingRoom } from './waiting_room';
import { Game } from './game';
import { GameService, GameStoreAdapter, GameEvents } from '../../components/game';

import { PlayerStoreAdapter, PlayerService } from '../../components/player';
import { MessageService, MessageStoreAdapter } from '../../components/messages';

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
	// playerEngine: PlayerEngineInterface;
	// gameEngine: GameEngineInterface;
	commService: CommunicationService;

	constructor(props: TheGameProps) {
		super(props);

		this.state = {
			gameState: GameState.LOADING,
			syncing: true
		};
	}

	componentDidMount(): void {
		this.setState({ gameState: GameState.WAITING_ROOM });
	}

	playerService: PlayerService;
	gameService: GameService;
	messageService: MessageService;
	drawingManager: DrawingManager;

	UNSAFE_componentWillMount(): void {
		this.eventBus = new EventBus();
		this.cacheStore = new CacheStore();

		const gameStoreAdapter = new GameStoreAdapter(this.cacheStore);
		const playerStoreAdapter = new PlayerStoreAdapter(this.cacheStore);
		const messageStoreAdapter = new MessageStoreAdapter(this.cacheStore);

		this.gameService = new GameService(gameStoreAdapter);
		this.playerService = new PlayerService(playerStoreAdapter);
		this.messageService = new MessageService(messageStoreAdapter);

		// Player Init
		this.playerService.create(PersistentStore.localName);

		// setup to synchronies
		this.commService = new CommunicationService(this.cacheStore, this.eventBus, this.props.roomName);

		this.eventBus.on('SYNCED', (data) => {
			this.setState({ gameState: GameState.WAITING_ROOM });
			if (data.synced) {
				this.setState({ syncing: false });
			}
		});

		this.sub = this.gameService.subject.subscribe((event) => {
			switch (event.type) {
				case GameEvents.GAME_STARTED:
					this.drawingManager = new DrawingManager(this.cacheStore);
					this.setState({ gameState: GameState.PLAY });

					break;
				case GameEvents.GAME_STOPPED:
					this.messageService && this.messageService.dispose();
					this.drawingManager && this.drawingManager.dispose();
					this.setState({ gameState: GameState.WAITING_ROOM });
					break;
			}
		});

		this.eventBus.addService(this.gameService);
		this.eventBus.addService(this.playerService);
		this.eventBus.addService(this.messageService);
	}

	sub: Subscription;
	componentWillUnmount(): void {
		this.sub.unsubscribe();
		// dispose all
		this.commService.dispose();

		// The new services
		this.messageService.dispose();
		this.drawingManager.dispose();
		this.playerService.dispose();
		this.gameService.dispose();

		// the last one
		this.cacheStore.dispose();
		this.eventBus.dispose();
	}

	render(): JSX.Element {
		const { onLeaveGame } = this.props;
		const { gameState } = this.state;

		let scene;

		// convert from string to number
		switch (+gameState) {
			case GameState.LOADING:
				scene = <div>Please Wait</div>;
				break;
			case GameState.WAITING_ROOM:
				scene = <WaitingRoom service={this.playerService} />;
				break;
			case GameState.PLAY:
				scene = (
					<Game
						service={this.gameService}
						messageService={this.messageService}
						drawingService={this.drawingManager}
					/>
				);
				break;
			default:
				scene = <div>Unknown State</div>;
		}
		// If Game, it means, connection to peers are established
		return (
			<React.Fragment>
				<GameControl service={this.gameService} onCancel={onLeaveGame} />
				{scene}
			</React.Fragment>
		);
	}
}
