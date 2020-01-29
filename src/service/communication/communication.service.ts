import Chance from 'chance';
import { WebrtcProvider } from './y-plugings/y-webrtc';
import { EventBusInterface } from '../event.bus';
import { PersistentStore, CacheStoreSyncInterface } from '../store';

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
 * 
 * 
 * TODO: implement awareness, that a player is connected....
 * At the moment, each player sends a heartbeat, meaning, the player sets the
 * lastOnline attribute on every seconds (just unix timestamp) 
 * and when the time difference is greater then f.e. 3 seconds, the *online*
 * attribute of each player evaluates to offline. When the *gone* attribute time difference is greater then f.e. 10 it evaluates to true.
 * 
 * Then the frontend does not render the player..
 * 
 * this way, even in a not fully connected network, the approach shows on and offline players..
 * 
 */

export class CommunicationService {
	private _provider;
	roomID: string;

	constructor(store: CacheStoreSyncInterface, eventBus: EventBusInterface, roomName = '') {
		const peerID = PersistentStore.id;
		// create random room name based on the peerID as seed.
		this.roomID = roomName === '' ? Chance(peerID).string({ length: 20, alpha: true, numeric: true }) : roomName;

		this.roomID = this.roomID.toLowerCase();

		const room = 'sketchguessr-' + this.roomID;

		this._provider = new WebrtcProvider(room, store.yDoc);

		this._provider.on('synced', (synced) => {
			console.error('synced!', synced);
			eventBus.onSync(synced);
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

		const ev = event || window.event;
		ev.preventDefault = true;
		ev.cancelBubble = true;
		ev.returnValue = '';
		ev.message = '';
	}
}
