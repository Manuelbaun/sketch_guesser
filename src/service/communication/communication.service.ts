import { Subject, NextObserver } from 'rxjs';
import PeerManager from './peer_manager';
import { Data, ConnectionData, CommunicationServiceInterface } from './communication.types';

export class CommunicationServiceImpl implements CommunicationServiceInterface {
	constructor() {
		const options = {
			debug: 2,
			host: 'sketchguessr.herokuapp.com',
			port: 27828
		};
		this.peerManager = new PeerManager(options);

		this.localID = this.peerManager.id;

		this.peerManager.onData = (data) => this._dataStream.next(data);
		this.peerManager.onConnection = (data) => this._connectionStream.next(data);
	}

	private provider;
	localID: string;
	private peerManager: PeerManager;
	private _connectionStream: Subject<ConnectionData> = new Subject();
	public get connectionStream(): Subject<ConnectionData> {
		return this._connectionStream;
	}

	private _dataStream: Subject<Data> = new Subject();
	public get dataStream(): Subject<Data> {
		return this._dataStream;
	}

	sendDataAll(data: Data) {
		this.peerManager.send(data);
	}

	sendDataToID(id: string, data: Data) {
		this.peerManager.sendDataToID(id, data);
	}

	subscribeToDataStream(observer: NextObserver<Data>) {
		return this.dataStream.subscribe(observer);
	}

	subscribeToConnectionStream(observer: NextObserver<ConnectionData>) {
		return this.connectionStream.subscribe(observer);
	}
}
