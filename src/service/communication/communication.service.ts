import { EventBusInterface } from '../event.bus';
import { WebrtcProvider } from './y.webrtc/y-webrtc-2';
import { CacheStoreInterface, PersistentStore } from '../storage';

// localStorage.log = 'y-webrtc'

export class CommunicationServiceImpl {
	private provider;

	constructor(cache: CacheStoreInterface, eventBus: EventBusInterface) {
		const roomName = 'sketchguessr-' + window.location.pathname;
		const password = null;

		const peerID = PersistentStore.localID;

		// provides an ID, should be unique generated!
		// now its a workaround...
		this.provider = new WebrtcProvider(roomName, cache.yDoc, {
			password,
			peerID
		});

		this.provider.on('synced', (synced) => {
			// console.log('synced!', synced);
		});

		this.provider.on('connected', (remotePeerId) => {
			eventBus.onPlayerConnected(remotePeerId);
		});

		// cleanup
		this.provider.on('closed', (remotePeerId) => {
			eventBus.onPlayerDisconnected(remotePeerId);
		});

		// some cleanup
		window.addEventListener('beforeunload', (e) => {
			this.provider.destroy();

			e.preventDefault();
			e.returnValue = '';
		});
	}
}
