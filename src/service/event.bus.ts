import { EventEmitter } from 'events';

export interface EventBusInterface {
	on(type: EventBusType, listener: (...args: any[]) => void);
	off(type: EventBusType, listener: (...args: any[]) => void);
	onPlayerConnected(peerID: string);
	onPlayerDisconnected(peerID: string);
}

type EventBusType = 'CONNECTION';

export class EventBus {
	private emitter: EventEmitter = new EventEmitter();

	// emitter wrapper
	on(type: EventBusType, listener: (...args: any[]) => void) {
		this.emitter.on(type, listener);
	}

	// emitter wrapper
	off(type: EventBusType, listener: (...args: any[]) => void) {
		this.emitter.off(type, listener);
	}

	onPlayerConnected(peerID: string) {
		this.emitter.emit('CONNECTION', {
			connected: true,
			peerId: peerID
		});
	}

	onPlayerDisconnected(peerID: string) {
		this.emitter.emit('CONNECTION', {
			connected: false,
			peerId: peerID
		});
	}
}
