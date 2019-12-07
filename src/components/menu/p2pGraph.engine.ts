import Graph from 'p2p-graph';
import {
	ConnectionData,
	ConnectionEventType,
	CommunicationServiceInterface
} from '../../service/communication/communication.type';

export default class P2PGraphEngine {
	constructor(comm: CommunicationServiceInterface) {
		this.sub = comm.connectionStream.subscribe({
			next: (data: ConnectionData) => this.onNext(data)
		});
	}
	graph;
	sub;
	peers = new Set<string>();

	unsubscribe() {
		this.sub.unsubscribe();
	}

	createGraph(element: React.MutableRefObject<null>) {
		this.graph = new Graph(element.current);
		// this.graph.on('select', function(id) {
		// 	// console.log(id + ' selected!');
		// });
		this.graph.add({
			id: 'local',
			me: true,
			name: 'You'
		});
	}

	onNext(data: ConnectionData) {
		if (data.type == ConnectionEventType.OPEN) this.addPeer(data.peerID);
		if (data.type == ConnectionEventType.CLOSE) this.removePeer(data.peerID);
	}

	addPeer(peerId: string) {
		if (this.peers.has(peerId)) return;

		// Add two peers
		this.graph.add({
			id: peerId,
			name: peerId
		});
		this.peers.add(peerId);
		this.graph.connect('local', peerId);
	}

	removePeer(peerId: string) {
		if (!this.peers.has(peerId)) return;
		this.graph.disconnect('local', peerId);
		this.graph.remove(peerId);
		this.peers.delete(peerId);
	}
}
