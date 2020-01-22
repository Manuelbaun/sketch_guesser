import { EventEmitter } from 'events';

export interface EventBusInterface {
	on(type: EventBusType, listener: (...args: any[]) => void);
	off(type: EventBusType, listener: (...args: any[]) => void);
	onPlayerConnection(id: string, connected: boolean);
	dispose();
}

type EventBusType = 'CONNECTION';

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

	dispose() {
		this.emitter.removeAllListeners();
		console.log('Eventbus dispose');
	}
}
