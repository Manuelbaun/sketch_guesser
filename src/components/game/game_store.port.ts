import { GameModelProp, GameModel } from './game.model';

export interface GameStorePort {
	updateProp(props: GameModelProp): void;
	onUpdate: (f: (prop: GameModelProp) => void) => void;
	dispose();
	get<K extends keyof GameModel>(key: K): GameModel[K] | undefined;
	set<K extends keyof GameModel>(key: K, value: GameModel[K]): void;
}
