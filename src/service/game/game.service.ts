import { IGameStoreAdapter, IKeyValue } from '../sync/game_store.adapter';
import { IGameModel, GameStates, GameStoreKeys } from '../../models';
import { Subject } from 'rxjs';
import sha256 from 'sha256';

export interface IGameService extends Subject<IKeyValue>, IGameModel {
	setProps(props: IGameModel);
	dispose();
}

export class GameService extends Subject<IKeyValue> implements IGameService {
	private _adapter: IGameStoreAdapter;

	constructor(adapter: IGameStoreAdapter) {
		super();
		if (!adapter) {
			throw new Error('Adapter for GameService is not defined');
		}
		this._adapter = adapter;
		this._adapter.on('update', this._handleUpdate);
	}

	dispose() {
		this._adapter.off('update', this._handleUpdate);
	}

	private _handleUpdate = (updates: IKeyValue) => {
		this.next(updates);
	};

	public setProps(props: IGameModel) {
		const arr = Object.entries(props).map(([ key, value ]) => {
			return {
				key,
				value
			} as IKeyValue;
		});

		this._adapter.setProps(arr);
	}

	/**
     * Getter currentMasterID
     * @return {string}
     */
	public get currentMasterID(): string {
		return this._adapter.get(GameStoreKeys.CURRENT_MASTER_ID);
	}

	get time(): number {
		return this._adapter.get(GameStoreKeys.TIME);
	}

	set time(value: number) {
		this._adapter.set(GameStoreKeys.TIME, value);
	}

	get timePerRound(): number {
		return this._adapter.get(GameStoreKeys.TIME_PER_ROUND);
	}

	set timePerRound(value: number) {
		this._adapter.set(GameStoreKeys.TIME_PER_ROUND, value);
	}
	/**
     * Getter currentRound
     * @return {number}
     */
	public get round(): number {
		return this._adapter.get(GameStoreKeys.ROUND);
	}

	/**
     * Getter rounds
     * @return {number}
     */
	public get roundsPerGame(): number {
		return this._adapter.get(GameStoreKeys.ROUNDS_PER_GAME);
	}

	/**
     * Getter codeWordHash
     * @return {string}
     */
	public get codeWordHash(): string {
		return this._adapter.get(GameStoreKeys.CODE_WORD_HASH);
	}

	/**
     * Getter state
     * @return {GameStates}
     */
	public get state(): GameStates {
		return this._adapter.get(GameStoreKeys.STATE) as GameStates;
	}

	/**
     * Setter currentMasterID
     * @param {string} value
     */
	public set currentMasterID(value: string) {
		this._adapter.set(GameStoreKeys.CURRENT_MASTER_ID, value);
	}

	/**
     * Setter currentRound
     * @param {number} value
     */
	public set round(value: number) {
		this._adapter.set(GameStoreKeys.ROUND, value);
	}

	/**
     * Setter rounds
     * @param {number} value
     */
	public set roundsPerGame(value: number) {
		this._adapter.set(GameStoreKeys.ROUNDS_PER_GAME, value);
	}

	/**
     * Setter codeWordHash
     * @param {string} value
     */
	public set codeWordHash(value: string) {
		this._adapter.set(GameStoreKeys.CODE_WORD_HASH, sha256(value));
	}

	/**
     * Setter state
     * @param {GameStates} value
     */
	public set state(value: GameStates) {
		this._adapter.set(GameStoreKeys.STATE, value);
	}
}
