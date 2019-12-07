import Peer from 'peerjs';
import { NextObserver, Subject } from 'rxjs';

import { Data, ConnectionData, ConnectionEventType, DataRaw } from './communication.type';

/**
 * The PeerManager:
 * onConnectionEvent
 * 	- open/ close
 * onData
 * sendData
 */

class PeerManager extends Peer {
	constructor(peerJSOptions: Peer.PeerJSOption) {
		super(peerJSOptions);

		this.on('open', (id) => this.onPeerOpen(id));
		this.on('close', () => this.onPeerClosed());
		this.on('error', (err) => this.onPeerError(err));
		// On incoming connection request
		this.on('connection', (conn) => this.setupConnection(conn));
		this.on('disconnected', () => this.onPeerDisconnected());
	}

	private localID: string;
	// manager: ConnectionManager = new ConnectionManager();
	private listOfAllPeers: string[] = new Array();
	private allConnections: Map<string, Peer.DataConnection> = new Map();

	private _connectionStream: Subject<ConnectionData> = new Subject();
	public get connectionStream(): Subject<ConnectionData> {
		return this._connectionStream;
	}

	private _dataStream: Subject<Data> = new Subject();
	public get dataStream(): Subject<Data> {
		return this._dataStream;
	}

	onPeerOpen(id: string): void {
		// Workaround for peer.reconnect deleting previous id
		if (id === null) {
			console.log('Received null id from peer open');
			this.id = this.localID;
		} else {
			this.localID = id;
		}

		// try to connect to all peers in that list
		// this happens only once, when the local peer
		// connects to the signaling server
		this.listAllPeers((allPeers: string[]) => {
			this.listOfAllPeers = allPeers;
			this.listOfAllPeers.forEach((peer) => {
				this.connectTo(peer);
			});
		});
	}

	onPeerDisconnected(): void {
		console.log('Connection lost. Please reconnect');
		this.reconnect();
	}

	onPeerClosed(): void {
		console.log('Connection destroyed');
	}

	onPeerError(err: any): void {
		console.error(err);
	}

	connectTo(peerID) {
		// catch if it is the own peerID
		if (peerID == this.id) return;

		// if the connection already exists
		if (this.allConnections.has(peerID)) {
			const conn = this.allConnections.get(peerID);
			if (conn && conn.open) return;
		}

		// Create connection to destination peer specified in the input field
		const conn = this.connect(peerID, {
			reliable: true
		});

		this.setupConnection(conn);
	}

	setupConnection(conn: Peer.DataConnection): void {
		if (this.allConnections[conn.peer] && conn.open) return;
		console.log('Setup Connection to: ' + conn.peer);

		// not sure, if connection is need at all
		conn.on('connection', () => console.log('Connection =>'));

		conn.on('open', () => this.onConnectionOpen(conn));
		conn.on('close', () => this.onConnectionClose(conn));

		// Handle incoming data (messages only since this is the signal sender)
		// Incoming Data
		conn.on('data', (data) => this.onConnectionData(conn, data));

		this.allConnections.set(conn.peer, conn);
	}

	onConnectionOpen(conn: Peer.DataConnection) {
		const { peer: id } = conn;
		console.log('Connected to: ', id);

		// emit event of new Connection
		this.connectionStream.next({ type: ConnectionEventType.OPEN, peerID: id });
	}

	onConnectionData(conn: Peer.DataConnection, dataRaw: DataRaw) {
		console.log('Data from:', conn.peer, dataRaw);
		// emit event of incoming data
		const { type } = dataRaw;
		const payload = new Uint8Array(dataRaw.payload);
		this.dataStream.next({ type, payload });
	}

	onConnectionClose(conn: Peer.DataConnection) {
		const { peer: id } = conn;
		console.log('Connection closed');
		this.allConnections.delete(id);
		this.allConnections[id] = null;
		this.connectionStream.next({ type: ConnectionEventType.CLOSE, peerID: id });
	}

	subscribeToDataStream(observer: NextObserver<Data>) {
		return this.dataStream.subscribe(observer);
	}

	subscribeToConnectionStream(observer: NextObserver<ConnectionData>) {
		return this.connectionStream.subscribe(observer);
	}

	send(data: Data) {
		this.allConnections.forEach((connection) => {
			connection.send(data);
		});
	}
}

export default PeerManager;
