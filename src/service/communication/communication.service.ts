import { Subject, NextObserver } from 'rxjs';
import PeerManager from './peer_manager';
import { Data, IConnectionData, ICommunicationService } from './communication.type';

// singleton?
export default class CommunicationServiceImpl implements ICommunicationService {
	constructor() {
		this.peerManager = new PeerManager({
			debug: 2,
			host: '192.168.178.149',
			port: 9000
		});

		this.localID = this.peerManager.id;

		this.peerManager.onData = (data) => this._dataStream.next(data);
		this.peerManager.onConnection = (data) => this._connectionStream.next(data);
	}

	localID: string;
	private peerManager: PeerManager;
	private _connectionStream: Subject<IConnectionData> = new Subject();
	public get connectionStream(): Subject<IConnectionData> {
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

	subscribeToConnectionStream(observer: NextObserver<IConnectionData>) {
		return this.connectionStream.subscribe(observer);
	}
}
