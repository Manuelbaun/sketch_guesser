import { Subject, NextObserver } from 'rxjs';
import { WebrtcProvider } from './y.webrtc/y-webrtc';
import { Data, ConnectionData, CommunicationServiceInterface } from './communication.types';
import { CacheEngineInterface } from '../../gameEngine';
import { EventBusInterface } from '../event.bus';

// localStorage.log = 'y-webrtc'
localStorage.log = false;

export class CommunicationServiceImpl implements CommunicationServiceInterface {
	private provider;

	constructor(cache: CacheEngineInterface, eventBus: EventBusInterface) {
		const roomName = 'sketchguessr-' + window.location.pathname;
		const password = null;

		console.log(roomName);

		this.provider = new WebrtcProvider(roomName, cache.yDoc, {
			// signaling: [ 'ws://localhost:4444' ],
			password
		});

		this.provider.on('synced', (synced) => {
			console.log('synced!', synced);
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

		try {
			this.localID = 'local';
			// TODO: used a hack around in webRTC to esablish an room...
			// getting this ID, it needs to be different
			console.log(this.provider.removeMeLaterID);
			this.localID = this.provider.removeMeLaterID || 'local';
		} catch (err) {
			console.error(err);
		}
	}

	localID: string;
	// private peerManager: PeerManager;
	private _connectionStream: Subject<ConnectionData> = new Subject();
	public get connectionStream(): Subject<ConnectionData> {
		return this._connectionStream;
	}

	private _dataStream: Subject<Data> = new Subject();
	public get dataStream(): Subject<Data> {
		return this._dataStream;
	}

	sendDataAll(data: Data) {
		// this.peerManager.send(data);
	}

	sendDataToID(id: string, data: Data) {
		// this.peerManager.sendDataToID(id, data);
	}
}
