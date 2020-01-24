import { IGameStoreAdapter, IKeyValue } from '../sync/game_store.adapter';
import { IGameModel, GameStates } from '../../models';
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
		return this._adapter.get('currentMasterID');
	}

	get currentTime(): number {
		return this._adapter.get('currentTime');
	}

	set currentTime(value: number) {
		this._adapter.set('currentTime', value);
	}

	get timePerRound(): number {
		return this._adapter.get('timePerRound');
	}

	set timePerRound(value: number) {
		this._adapter.set('timePerRound', value);
	}
	/**
     * Getter currentRound
     * @return {number}
     */
	public get currentRound(): number {
		return this._adapter.get('currentRound');
	}

	/**
     * Getter rounds
     * @return {number}
     */
	public get rounds(): number {
		return this._adapter.get('rounds');
	}

	/**
     * Getter codeWordHash
     * @return {string}
     */
	public get codeWordHash(): string {
		return this._adapter.get('codeWordHash');
	}

	/**
     * Getter state
     * @return {GameStates}
     */
	public get state(): GameStates {
		return this._adapter.get('state') as GameStates;
	}

	/**
     * Setter currentMasterID
     * @param {string} value
     */
	public set currentMasterID(value: string) {
		this._adapter.set('currentMasterID', value);
	}

	/**
     * Setter currentRound
     * @param {number} value
     */
	public set currentRound(value: number) {
		this._adapter.set('currentRound', value);
	}

	/**
     * Setter rounds
     * @param {number} value
     */
	public set rounds(value: number) {
		this._adapter.set('rounds', value);
	}

	/**
     * Setter codeWordHash
     * @param {string} value
     */
	public set codeWordHash(value: string) {
		this._adapter.set('codeWordHash', sha256(value));
	}

	/**
     * Setter state
     * @param {GameStates} value
     */
	public set state(value: GameStates) {
		this._adapter.set('state', value);
	}
}
