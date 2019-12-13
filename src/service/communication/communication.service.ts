import { EventBusInterface } from '../event.bus';
import { WebrtcProvider } from './y.webrtc/y-webrtc-2';
import { CacheStoreInterface, PersistentStore } from '../storage';

import Chance from 'chance';

// localStorage.log = 'y-webrtc'

export class CommunicationServiceImpl {
	private provider;
	roomID: string;

	constructor(cache: CacheStoreInterface, eventBus: EventBusInterface, roomName: string = '') {
		const peerID = PersistentStore.localID;
		this.roomID = roomName === '' ? Chance(peerID).string({ length: 20, alpha: true, numeric: true }) : roomName;

		this.roomID = this.roomID.toLowerCase();
		console.log(this.roomID);
		const room = 'sketchguessr-' + this.roomID;

		const password = null;

		// provides an ID, should be unique generated!
		// now its a workaround...
		this.provider = new WebrtcProvider(room, cache.yDoc, {
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
