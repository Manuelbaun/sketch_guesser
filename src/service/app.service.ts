import { Subject, Subscription } from 'rxjs';
import { GameStoreAdapter, GameService } from '../components/game';
import { PlayerStoreAdapter, PlayerService } from '../components/player';
import { MessageStoreAdapter, MessageService } from '../components/messages';
import { DrawingStoreAdapter, DrawingService } from '../components/drawing';
import { EventBus, CacheStoreSyncInterface, CommunicationService, CacheStoreSync, PersistentStore } from '.';

export enum AppEventType {
	GAME_START = 'game_start',
	GAME_END = 'game_end'
}

export interface AppStateEvent {
	type: AppEventType;
	value: any;
}

function createEvent(type: AppEventType, value: any): AppStateEvent {
	return { type, value };
}

export class AppService {
	gameEntered = false;
	roomID: string;
	subject: Subject<AppStateEvent> = new Subject();

	cacheStore: CacheStoreSyncInterface;
	commService: CommunicationService;
	eventBus: EventBus;

	// Adapters
	drawingStoreAdapter: DrawingStoreAdapter;
	gameStoreAdapter: GameStoreAdapter;
	messageStoreAdapter: MessageStoreAdapter;
	playerStoreAdapter: PlayerStoreAdapter;

	// services
	drawingService: DrawingService;
	gameService: GameService;
	messageService: MessageService;
	playerService: PlayerService;

	startGame() {
		if (this.gameService.isGameRunning()) return;
		console.log('START GAME');

		this.gameService.setupGame({});
		this.gameService.startGame();
	}

	stopGame() {
		if (!this.gameService.isGameRunning()) return;
		console.log('STOP GAME');
		this.gameService.stopGame();

		// clears the store for all!
		this.drawingService.clearDrawing();
		this.messageService.clearMessages();
	}

	nextRound() {
		this.gameService.nextRound();
	}

	enterGame(roomID = ''): void {
		if (this.gameEntered) {
			console.error("Can't enter the game twice");
			return;
		}
		this.roomID = roomID;

		// THE Big Setup
		this.eventBus = new EventBus();
		this.cacheStore = new CacheStoreSync();

		// Instance of the Adapers
		this.gameStoreAdapter = new GameStoreAdapter(this.cacheStore);
		this.playerStoreAdapter = new PlayerStoreAdapter(this.cacheStore);
		this.messageStoreAdapter = new MessageStoreAdapter(this.cacheStore);
		this.drawingStoreAdapter = new DrawingStoreAdapter(this.cacheStore);

		//
		this.gameService = new GameService(this.gameStoreAdapter);
		this.playerService = new PlayerService(this.playerStoreAdapter);
		this.messageService = new MessageService(this.messageStoreAdapter);
		this.drawingService = new DrawingService(this.drawingStoreAdapter);

		// Player Init
		this.playerService.create(PersistentStore.localName);

		// setup to Communication Service to connect to others
		this.commService = new CommunicationService(this.cacheStore, this.eventBus, this.roomID);

		this.eventBus.addService(this.gameService);
		this.eventBus.addService(this.playerService);
		this.eventBus.addService(this.messageService);
		this.eventBus.addService(this.drawingService);

		this.gameEntered = true;
		this.subject.next(createEvent(AppEventType.GAME_START, roomID));
	}

	exitGame(): void {
		// Dispose of Services
		this.commService.dispose();
		this.playerService.dispose();
		this.gameService.dispose();
		this.eventBus.dispose();

		// Dispose of Adapter
		this.gameStoreAdapter.dispose();
		this.playerStoreAdapter.dispose();
		this.drawingStoreAdapter.dispose();
		this.messageStoreAdapter.dispose();

		// dispose the whole storage
		this.cacheStore.dispose();

		this.roomID = '';
		this.subject.next(createEvent(AppEventType.GAME_END, this.roomID));
		this.gameEntered = false;
	}
}
