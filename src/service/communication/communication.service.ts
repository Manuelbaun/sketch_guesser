import Chance from 'chance';

import { EventBusInterface } from '../event.bus';
import { WebrtcProvider } from './y-webrtc';

import { CacheStoreInterface, PersistentStore } from '../../storage';

/**
 * This is the CommunicationService.
 * 
 * It uses the **WebRTCProvider** from the *y-webrtc* developed by the yjs inventor.
 * For the purpose of this game, it needed to be modified in such a way, that it
 * accepts an ID for the peer ID which is essential to the game to be playable. 
 * Normally, it would create a random ID every time the WebRTC class gets instantiated
 * 
 * Additionally, it now provides some events, to which can be listens to, like a webrtc connection happend or a connection was closed.
 * 
 * The webrtc provider class uses the different signaling server with **websocket secure** 
 * which are provided by the inventor of yjs. Therefore, each room starts actually 
 * with **sketchguessr-{roomname}**. 
 * 
 * 
 * Important Note, the WebRTCProvider manages all synchronization, which different sync strategies
 * in order to sync the y document => no further sync mechanics are required for a 
 * basic functional game. Since this is a prove of concept, it shows, 
 * that this is sufficient enough.
 */

export class CommunicationService {
	private _provider;
	roomID: string;

	constructor(store: CacheStoreInterface, eventBus: EventBusInterface, roomName: string = '') {
		const peerID = PersistentStore.clientID;
		// create random room name based on the peerID as seed.
		this.roomID = roomName === '' ? Chance(peerID).string({ length: 20, alpha: true, numeric: true }) : roomName;

		this.roomID = this.roomID.toLowerCase();

		const room = 'sketchguessr-' + this.roomID;

		this._provider = new WebrtcProvider(room, store.yDoc, {
			password: null,
			peerID: PersistentStore.localID
		});

		this._provider.on('synced', (synced) => {
			console.log('synced!', synced);
		});

		this._provider.on('peers', (peers) => {
			console.log(peers);
			peers.added.forEach((peerID) => eventBus.onPlayerConnection(peerID, true));
			peers.removed.forEach((peerID) => eventBus.onPlayerConnection(peerID, false));
		});

		// Clean up Provider
		window.onbeforeunload = (event) => this.dispose(event);
	}

	// cleanup
	async dispose(event?) {
		console.log('Communication service dispose');
		await this._provider.destroy();

		let ev = event || window.event;
		ev.preventDefault = true;
		ev.cancelBubble = true;
		ev.returnValue = '';
		ev.message = '';
	}
}
