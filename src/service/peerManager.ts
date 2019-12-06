import Peer from 'peerjs';
import P2PGraphEngine from '../components/p2pGraph/p2pGraph.engine';

interface PeerManagerOptions {
	onCurrentStateRequest: Function;
	onDataReceived: Function;
}

export default class PeerManager extends Peer {
	constructor(id: string, peerjsOptions: Peer.PeerJSOption, engine: P2PGraphEngine, options: PeerManagerOptions) {
		super(id, peerjsOptions);
		this.engine = engine;

		this.onDataReceived = options.onDataReceived;
		this.onIncomingConnection = options.onCurrentStateRequest;

		this.initialize();
	}
	engine: P2PGraphEngine;
	lastPeerId: string;
	allConnections: Map<string, Peer.DataConnection> = new Map();

	allPeers: string[] = new Array();

	onDataReceived: Function;
	onIncomingConnection: Function;

	connectFullMesh(): void {
		this.allPeers.forEach((peer) => {
			this.join(peer)
				.then(() => {
					console.log('connected to ' + peer);
				})
				.catch(() => {
					console.log('error connecting to' + peer);
				});
		});
	}

	initialize() {
		this.on('open', (id) => {
			// Workaround for peer.reconnect deleting previous id
			if (this.id === null) {
				console.log('Received null id from peer open');
				this.id = this.lastPeerId;
			} else {
				this.lastPeerId = this.id;
			}

			this.listAllPeers((allPeers) => {
				this.allPeers = allPeers;
				console.log(allPeers);
				this.connectFullMesh();
			});
			console.log('ID: ' + this.id);
		});

		this.on('connection', (conn) => {
			if (!this.allConnections[conn.peer]) {
				console.log('Incoming Connected to: ' + conn.peer);
				/**
                 * Triggered once a connection has been achieved.
                 * Defines callbacks to handle incoming data and connection events.
                 */

				conn.on('open', () => {
					this.engine.addPeer(conn.peer);
					console.log('incoming is open');
					const state = this.onIncomingConnection(conn);
					conn.send(state);
				});

				conn.on('data', (data) => {
					if (this.onDataReceived) {
						this.onDataReceived(data);
					}
				});

				conn.on('close', () => {
					console.log('Close connection');
					// TODO: Remove stuff
					this.engine.removePeer(conn.peer);
				});

				this.allConnections.set(conn.peer, conn);
			} else {
				console.log('allready connected to', conn.peer);
			}
		});

		this.on('disconnected', () => {
			console.log('Connection lost. Please reconnect');

			// Workaround for peer.reconnect deleting previous id
			// this.peer.id = this.lastPeerId;
			// this.peer._lastServerId = this.lastPeerId;
			this.reconnect();
		});

		this.on('close', () => {
			// this.conn = null;
			console.log('Connection destroyed');
		});

		this.on('error', (err) => {
			console.error(err);
		});
	}

	join(peerID) {
		return new Promise((resolve, reject) => {
			if (peerID == this.id) return;
			let conn = this.allConnections.get(peerID);
			if (conn) return;
			// if (conn == null) return;

			// Create connection to destination peer specified in the input field
			conn = this.connect(peerID, {
				reliable: true
			});

			conn.on('connection', () => {
				console.log('Connection =>');
			});

			conn.on('open', () => {
				// @ts-ignore
				console.log('Connected to: ' + peerID);

				this.engine.addPeer(peerID);
			});

			// Handle incoming data (messages only since this is the signal sender)
			conn.on('data', (data) => {
				if (this.onDataReceived) {
					this.onDataReceived(data);
				}
			});

			conn.on('close', () => {
				console.log('Connection closed');
				this.allConnections.delete(peerID);
				this.allConnections[peerID] = null;

				this.engine.removePeer(peerID);
			});

			this.allConnections.set(peerID, conn);
			console.log('new peer connected with ping');

			resolve(true);
		});
	}

	/**
		 * Send a signal via the peer connection and add it to the log.
		 * This will only occur if the connection is still alive.
		 */
	broadcast(type, payload) {
		this.allConnections.forEach((conn, key, map) => {
			if (conn.open) {
				conn.send({
					type,
					payload
				});
			}
		});
	}

	send(id, msg) {
		const conn = this.allConnections.get(id);
		conn && conn.send(msg);
	}
}
