import { PlayerModel, PlayerProps } from './player.model';

export interface PlayerStorePort {
	/**
	 * Function adds a local player!
	 * @param player the local player
	 */
	add(player: PlayerModel): PlayerModel;
	/**
	 * 
	 * @param props Props
	 */
	updateProp(props: PlayerProps);
	onUpdate(handler: (player: Map<string, PlayerModel>) => void);
}

// use as a base class?
// export interface IStoreAdapter<Keys> {
// 	set(key: Keys, value: any): void;
// 	setMulti(arg0: Array<{ key: Keys; value: any }>): void;
// 	get(key: Keys): any;
// 	dispose();
// }
