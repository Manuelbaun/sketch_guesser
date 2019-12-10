import { Subscription } from 'rxjs';

import { CacheEngineInterface } from './cache.engine';
import {
	CommunicationServiceInterface,
	ConnectionData,
	ConnectionEventType
} from '../service/communication/communication.types';
import { Player } from '../models';

export class PlayerEngine {
	private _sub: Subscription;
	private _localID: string;
	yMapPlayer;

	public get playerNum(): number {
		return this.yMapPlayer.values.length;
		// return 2;
	}

	public get localID(): string {
		return this._localID;
	}

	constructor(cache: CacheEngineInterface, comm: CommunicationServiceInterface) {
		this.yMapPlayer = cache.players;
		this._localID = comm.localID;
		this.localName = this.localID;
		this._sub = comm.connectionStream.subscribe({
			next: (data: ConnectionData) => this.onNext(data)
		});

		this.addPlayer(this.localID);
		console.log('PlayerEngine init');
	}

	unsubscribe() {
		this._sub.unsubscribe();
	}

	onNext(data: ConnectionData) {
		if (data.type === ConnectionEventType.OPEN) this.addPlayer(data.peerID);
		if (data.type === ConnectionEventType.CLOSE) this.removePlayer(data.peerID);
	}

	addPlayer(peerId: string) {
		const player = this.yMapPlayer.get(peerId) as Player;
		if (player) return;

		this.yMapPlayer.set(peerId, {
			id: peerId,
			name: peerId,
			points: 0
		});
	}
	localName: string;
	updateLocalName(name: string) {
		this.localName = name;
		const player = this.yMapPlayer.get(this.localID) as Player;
		this.update(this.localID, {
			...player,
			name: name
		});
	}

	update(peerId: string, p: Player) {
		const player = this.yMapPlayer.get(peerId) as Player;

		if (!player) return;

		this.yMapPlayer.set(peerId, {
			id: peerId,
			name: p.name || peerId,
			points: p.points || 0
		});
	}

	addLocalPoints(points: number) {
		this.addPoints(this.localID, points);
	}

	addPoints(peerId: string, points: number) {
		const player = this.yMapPlayer.get(peerId) as Player;
		if (!player) return;

		this.yMapPlayer.set(peerId, {
			...player,
			points: player.points + points
		});
	}

	removePlayer(peerId: string) {
		const player = this.yMapPlayer.get(peerId) as Player;
		if (!player) return;

		this.yMapPlayer.delete(peerId);
	}
}
