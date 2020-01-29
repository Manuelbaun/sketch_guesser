import { EventEmitter } from 'events';
import { Subscription } from 'rxjs';
import { ServiceInterface } from '../components/base/service.interface';

export interface EventBusInterface {
	on(type: EventBusType, listener: (...args: any[]) => void);
	off(type: EventBusType, listener: (...args: any[]) => void);
	onSync(data: any);
	onPlayerConnection(id: string, connected: boolean);
	dispose();
	addService(service);
}

type EventBusType = 'CONNECTION' | 'SYNCED';

/**
 * NOTE:
 * At the Moment, the EVent bus is not really used other then
 * subscribe to the services and log there events to the console
 */
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
	addService(service: ServiceInterface<any>) {
		const sub = service.subject.subscribe((data) => console.log(service.constructor.name, data));

		this.subs.push(sub);
	}
}
