import { Player } from './player.model';
import { ServiceInterface } from '../base/service.interface';

export interface PlayerServiceInterface extends ServiceInterface<Player[]> {
	players: Player[];
	create(name: string): void;
	addPoints(points: number): void;
	updateName(name: string): void;
	isLocalPlayer(id: number): boolean;
}
