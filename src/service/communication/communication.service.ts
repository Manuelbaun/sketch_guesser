import Chance from 'chance';

import { EventBusInterface } from '../event.bus';
import { WebrtcProvider } from './y-webrtc';

import { CacheStoreInterface, PersistentStore } from '../storage';
import { Awareness } from './custom-awareness';

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

export class CommunicationServiceImpl {
	private provider;
	roomID: string;

	constructor(store: CacheStoreInterface, eventBus: EventBusInterface, roomName: string = '') {
		const peerID = PersistentStore.clientID;
		// create random room name based on the peerID as seed.
		this.roomID = roomName === '' ? Chance(peerID).string({ length: 20, alpha: true, numeric: true }) : roomName;

		this.roomID = this.roomID.toLowerCase();

		const room = 'sketchguessr-' + this.roomID;

		/**
		 * provides an ID, should be unique generated!
		 * This is a workaround.
		 */
		const aw = new Awareness(store.yDoc);

		aw.on('change', ({ added, updated, removed }, origin) => {
			const state = aw.getStates();

			console.log(added, updated, removed);

			if (added.length > 0) {
				added.forEach((element) => {
					eventBus.onPlayerConnected(element.toString());
				});
			}

			if (updated.length > 0) {
				// console.log('Player updated', updated, origin);
			}

			if (removed.length > 0) {
				removed.forEach((element) => {
					eventBus.onPlayerDisconnected(element.toString());
				});
			}
		});

		this.provider = new WebrtcProvider(room, store.yDoc, {
			password: null,
			awareness: aw
		});

		this.provider.on('synced', (synced) => {
			console.log('synced!', synced);
		});

		// cleanup
		this.provider.on('closed', (remotePeerId) => {
			console.log('closed', remotePeerId);
		});

		// Clean up Provider
		window.onbeforeunload = async (event) => {
			var message = '';
			await this.provider.destroy();
			console.log('destroyed provider');

			event = event || window.event;
			event.preventDefault = true;
			event.cancelBubble = true;
			event.returnValue = '';
		};
	}
}
