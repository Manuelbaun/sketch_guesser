import React from 'react';
import { Subscription } from 'rxjs';
import {
	EventBus,
	CacheStoreSyncInterface,
	CommunicationService,
	CacheStoreSync,
	PersistentStore,
	AppService
} from '../../service';

import { GameControl } from '../../ui-components';
import { WaitingRoom } from './waiting_room';
import { Game } from './game';
import { GameService, GameStoreAdapter, GameEvents } from '../../components/game';

import { PlayerStoreAdapter, PlayerService } from '../../components/player';
import { MessageStoreAdapter } from '../../components/messages';
import { DrawingStoreAdapter } from '../../components/drawing';

type Props = {
	service: AppService;
};

type State = {
	gameState: GameState;
};

enum GameState {
	WAITING_ROOM,
	PLAY,
	LOADING
}

export class GameScene extends React.Component<Props, State> {
	eventBus: EventBus;
	cacheStore: CacheStoreSyncInterface;
	commService: CommunicationService;

	constructor(props: Props) {
		super(props);

		this.state = {
			gameState: GameState.WAITING_ROOM
		};
	}

	componentDidMount(): void {
		this.setState({ gameState: GameState.WAITING_ROOM });
	}

	playerService: PlayerService;
	gameService: GameService;

	gameStoreAdapter: GameStoreAdapter;
	playerStoreAdapter: PlayerStoreAdapter;
	messageStoreAdapter: MessageStoreAdapter;
	drawingStoreAdapter: DrawingStoreAdapter;

	UNSAFE_componentWillMount(): void {
		this.eventBus = new EventBus();
		this.cacheStore = new CacheStoreSync();

		this.gameStoreAdapter = new GameStoreAdapter(this.cacheStore);
		this.playerStoreAdapter = new PlayerStoreAdapter(this.cacheStore);
		this.messageStoreAdapter = new MessageStoreAdapter(this.cacheStore);
		this.drawingStoreAdapter = new DrawingStoreAdapter(this.cacheStore);

		this.gameService = new GameService(this.gameStoreAdapter);
		this.playerService = new PlayerService(this.playerStoreAdapter);

		// Player Init
		this.playerService.create(PersistentStore.localName);

		// setup to synchronies
		this.commService = new CommunicationService(this.cacheStore, this.eventBus, this.props.service.roomID);

		this.sub = this.gameService.subject.subscribe((event) => {
			switch (event.type) {
				case GameEvents.GAME_STARTED:
					this.setState({ gameState: GameState.PLAY }, () => {
						console.log('Set STate GameSTarted');
					});

					break;
				case GameEvents.GAME_STOPPED:
					this.setState({ gameState: GameState.WAITING_ROOM });
					break;
			}
		});

		this.eventBus.addService(this.gameService);
		this.eventBus.addService(this.playerService);
	}

	sub: Subscription;
	componentWillUnmount(): void {
		this.sub.unsubscribe();
		// dispose all
		this.commService.dispose();

		this.playerService.dispose();
		this.gameService.dispose();

		// the last one
		this.cacheStore.dispose();
		this.eventBus.dispose();
	}

	render(): JSX.Element {
		const { service } = this.props;
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
						gameService={this.gameService}
						drawingStoreAdapter={this.drawingStoreAdapter}
						messageStoreAdapter={this.messageStoreAdapter}
					/>
				);
				break;
			default:
				scene = <div>Unknown State</div>;
		}
		// If Game, it means, connection to peers are established
		return (
			<React.Fragment>
				<GameControl service={this.gameService} onExit={(): void => service.exitGame()} />
				{scene}
			</React.Fragment>
		);
	}
}
