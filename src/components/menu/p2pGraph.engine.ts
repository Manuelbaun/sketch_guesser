import Graph from './lib/graph';
import PlayerEngine, { Player } from '../../engine/player.engine';

export default class P2PGraphEngine {
	graph;
	localID: string;
	constructor(engine: PlayerEngine) {
		this.localID = engine.localID;
		// only observe and act accordingly
		engine.playerDoc.observe((event) => {
			console.log('P2PGraphEngine Player Event', event);
			event.keysChanged.forEach((key) => {
				const player = engine.playerDoc.get(key) as Player;
				console.log(key, player);
				if (player) this.updatePeer(key as string, player);
			});
		});
	}

	createGraph(element: React.MutableRefObject<null>) {
		this.graph = new Graph(element.current);
		console.log(this.graph);

		this.addLocalPlayer('', 0);
	}

	addLocalPlayer(name: string, point: number) {
		try {
			this.graph.add({
				id: this.localID,
				me: true,
				name: name || 'You',
				points: point
			});
		} catch (err) {
			console.error(err);
		}
	}

	updatePeer(id: string, player: Player) {
		// this.removePeer(id);
		const list = this.graph.list() as Array<any>;

		const node = list.find(n => n.id === id);

		if(node) {
			node.name = "kalsdjflksdjf";
			this.graph.forceUpdate();
		}

		// if (id === this.localID) {
		// 	this.addLocalPlayer(player.name, player.points);
		// } else {
		// 	this.addPeer(id, player.name, player.points);
		// }
	}

	addPeer(peerId: string, name?: string, points?: number) {
		try {
			this.graph.add({
				id: peerId,
				name: name || peerId
			});

			this.graph.connect(this.localID, peerId);
		} catch (err) {
			// console.error(err);
		}
	}

	removePeer(peerId: string) {
		try {
			this.graph.disconnect(this.localID, peerId);
		} catch (err) {
			// console.error(err);
		}

		try {
			this.graph.remove(peerId);
		} catch (err) {
			// console.error(err);
		}
	}
}
