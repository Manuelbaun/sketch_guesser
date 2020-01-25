import { EventEmitter } from 'events';
import { IGameService } from './game/game.service';
import { Subscription } from 'rxjs';

export interface EventBusInterface {
	on(type: EventBusType, listener: (...args: any[]) => void);
	off(type: EventBusType, listener: (...args: any[]) => void);
	onSync(data: any);
	onPlayerConnection(id: string, connected: boolean);
	dispose();
	addService(service);
}

type EventBusType = 'CONNECTION' | 'SYNCED';

export class EventBus implements EventBusInterface {
	private emitter: EventEmitter = new EventEmitter();

	// emitter wrapper
	on(type: EventBusType, listener: (...args: any[]) => void) {
		this.emitter.on(type, listener);
	}

	// emitter wrapper
	off(type: EventBusType, listener: (...args: any[]) => void) {
		this.emitter.off(type, listener);
	}

	onPlayerConnection(id: string, connected: boolean) {
		this.emitter.emit('CONNECTION', {
			connected,
			id
		});
	}

	onSync(data: any) {
		this.emitter.emit('SYNCED', data);
	}

	dispose() {
		this.emitter.removeAllListeners();
		this.subs.forEach((sub) => sub.unsubscribe());
		console.log('Eventbus dispose');
	}

	subs = new Array<Subscription>();
	addService(service: IGameService) {
		this.subs.push(service.subscribe((data) => console.log(service.constructor.name, data)));
	}
}
