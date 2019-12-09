import { Subscription } from 'rxjs';
import { ICacheEngine } from './cache.engine';
import {
	ICommunicationService,
	IConnectionData,
	ConnectionEventType
} from '../service/communication/communication.type';
import { IPlayer } from '../models';

/**
 * Player YMap
 * @example
 * interface _YMap {
 *	 id: string;
 *	 player: Player;
 * }
 * 
 */

export default class PlayerEngine {
	/**
	 * @type YArray<Message>
	 */
	playerDoc;
	name: string = 'You';
	sub: Subscription;
	playerNum: number = 1;
	localID: string;

	constructor(cache: ICacheEngine, comm: ICommunicationService) {
		this.playerDoc = cache.players;

		this.localID = comm.localID;
		console.log('should not be null', this.localID);

		this.sub = comm.connectionStream.subscribe({
			next: (data: IConnectionData) => this.onNext(data)
		});

		this.addPlayer(this.localID);
		console.log('PlayerEngine init');
	}

	unsubscribe() {
		this.sub.unsubscribe();
	}

	onNext(data: IConnectionData) {
		if (data.type === ConnectionEventType.OPEN) this.addPlayer(data.peerID);
		if (data.type === ConnectionEventType.CLOSE) this.removePlayer(data.peerID);
	}

	addPlayer(peerId: string) {
		const player = this.playerDoc.get(peerId) as IPlayer;
		if (player) return;

		this.playerDoc.set(peerId, {
			id: peerId,
			name: peerId,
			points: 0
		});
		this.playerNum++;
	}

	updateLocalName(name: string) {
		const player = this.playerDoc.get(this.localID) as IPlayer;
		console.log(name);
		this.update(this.localID, {
			...player,
			name: name
		});
	}

	update(peerId: string, p: IPlayer) {
		const player = this.playerDoc.get(peerId) as IPlayer;

		if (!player) return;

		this.playerDoc.set(peerId, {
			id: peerId,
			name: p.name || peerId,
			points: p.points || 0
		});
	}

	addLocalPoints(points: number) {
		this.addPoints(this.localID, points);
	}

	addPoints(peerId: string, points: number) {
		const player = this.playerDoc.get(peerId) as IPlayer;
		if (!player) return;

		this.playerDoc.set(peerId, {
			...player,
			points: player.points + points
		});
	}

	removePlayer(peerId: string) {
		const player = this.playerDoc.get(peerId) as IPlayer;
		if (!player) return;

		this.playerDoc.delete(peerId);
		this.playerNum--;
	}
}