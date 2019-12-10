import Peer from 'peerjs';

import { Data, ConnectionData, ConnectionEventType, DataRaw } from './communication.types';

// Dirty workaround
var chance = require('chance')();
let id = localStorage.getItem('fakeId') as string;

id = chance.string({ length: 10, alpha: true, numeric: true }) as string;
if (!id) {
	localStorage.setItem('fakeId', id);
}

/**
 * The PeerManager:
 * onConnectionEvent
 * 	- open/ close
 * onData
 * sendData
 */

class PeerManager extends Peer {
	constructor(peerJSOptions?: Peer.PeerJSOption) {
		super(id, peerJSOptions);

		this.on('open', (id) => this.onPeerOpen(id));
		this.on('close', () => this.onPeerClosed());
		this.on('error', (err) => this.onPeerError(err));
		// On incoming connection request
		this.on('connection', (conn) => this.setupConnection(conn));
		this.on('disconnected', () => this.onPeerDisconnected());
	}

	private localID: string;
	private listOfAllPeers: string[] = new Array();
	private allConnections: Map<string, Peer.DataConnection> = new Map();

	private onPeerOpen(id: string): void {
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

	private onPeerDisconnected(): void {
		console.log('Connection lost. Please reconnect');
		this.reconnect();
	}

	private onPeerClosed(): void {
		console.log('Connection destroyed');
	}

	private onPeerError(err: any): void {
		console.error(err);
	}

	private connectTo(peerID) {
		// catch if it is the own peerID
		if (peerID === this.id) return;

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

	private setupConnection(conn: Peer.DataConnection): void {
		if (this.allConnections[conn.peer] && conn.open) return;
		console.log('Setup Connection to: ' + conn.peer);

		// not sure, if connection is need at all
		conn.on('connection', () => console.log('Connection =>'));

		conn.on('open', () => this.onConnectionOpen(conn));
		conn.on('close', () => this.onConnectionClose(conn));

		// Incoming Data
		conn.on('data', (data) => this.onConnectionData(conn, data));

		this.allConnections.set(conn.peer, conn);
	}

	private onConnectionOpen(conn: Peer.DataConnection) {
		const { peer: id } = conn;
		console.log('Connected to: ', id);

		// emit event of new Connection
		this.onConnection({ type: ConnectionEventType.OPEN, peerID: id });
	}

	private onConnectionData(conn: Peer.DataConnection, dataRaw: DataRaw) {
		// console.log('Data from:', conn.peer, dataRaw);
		// emit event of incoming data
		const { type } = dataRaw;
		const payload = new Uint8Array(dataRaw.payload);
		this.onData({ type, payload });
	}

	private onConnectionClose(conn: Peer.DataConnection) {
		const { peer: id } = conn;
		console.log('Connection closed');
		this.allConnections.delete(id);
		this.allConnections[id] = null;
		this.onConnection({ type: ConnectionEventType.CLOSE, peerID: id });
	}

	onData = (data: Data): void => {};
	onConnection = (data: ConnectionData): void => {};

	send(data: Data) {
		this.allConnections.forEach((connection) => {
			connection.send(data);
		});
	}

	sendDataToID(id: string, data: Data) {
		const conn = this.allConnections.get(id);
		if (conn) conn.send(data);
		else console.log('No connection to peer with id', id);
	}
}

export default PeerManager;
