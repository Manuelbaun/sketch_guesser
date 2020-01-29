import { Subject } from 'rxjs';

export enum AppEventType {
	GAME_START,
	GAME_END
}

export interface AppStateEvent {
	type: AppEventType;
	value: any;
}

function createEvent(type: AppEventType, value: any): AppStateEvent {
	return { type, value };
}

export class AppService {
	subject: Subject<AppStateEvent> = new Subject();
	roomID: string;

	startGame(roomID = ''): void {
		this.roomID = roomID;
		this.subject.next(createEvent(AppEventType.GAME_START, roomID));
	}

	exitGame(): void {
		this.roomID = '';
		this.subject.next(createEvent(AppEventType.GAME_END, this.roomID));
	}
}
