import { PlayerProps, Player, GameModel } from '../models';
import { Map as YMap } from 'yjs';
import ulog from 'ulog';
import { CacheStoreInterface } from '../service';

const log = ulog('player.adapter');

export class GameStoreAdapter {
	private _store = new YMap<any>();
	private _gameModel: GameModel;

	/**
     * Getter gameModel
     * @return {GameModel}
     */
	public get gameModel(): GameModel {
		return this._gameModel;
	}

	observer;

	constructor(store: CacheStoreInterface) {
		log.debug(store.hasGameState);
		// checks before calling gameState! calling Gamestate
		// will create a new map or yield an existing one.
		// therefore check if it exits before
		// if not, then setting props must happen, otherwise not
		const gameStateDidExist = store.yDoc.share.has('gameState');
		this._store = store.yDoc.getMap('gameState');
		this._gameModel = new GameModel(store.gameState);

		if (!gameStateDidExist) {
			// TODO: Missing props!!1
			// set Master!
			// this._gameModel.setProps();
		}
	}

	// clean up!
	dispose() {
		// TODO:
		console.debug('Please Implement me');
	}
}
