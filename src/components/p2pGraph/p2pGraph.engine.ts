import { Subject } from 'rxjs/internal/Subject';

interface PeerGraph {
	id: string;
}

export default class P2PGraphEngine extends Subject<any> {
	constructor() {
		super();
	}

	peers = new Set<string>();

	onPeerConnected = (peerId: string) => {};

	onPeerDisconnected = (peerId: string) => {};

	addPeer(peerId: string) {
		if (this.peers.has(peerId)) return;

		this.peers.add(peerId);
		this.onPeerConnected(peerId);
	}

	removePeer(peerId: string) {
		if (!this.peers.has(peerId)) return;
		this.onPeerDisconnected(peerId);
		this.peers.delete(peerId);
	}
}
