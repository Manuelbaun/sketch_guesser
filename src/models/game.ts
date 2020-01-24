// import * as Y from 'yjs';
import { Map as YMap } from 'yjs';

import sha256 from 'sha256';
import { Subject } from 'rxjs';

/**
 * GameState in the Gamestate YDoc
 */
export enum GameStates {
	WAITING = 'WAITING',
	CHOOSING_WORD = 'CHOOSE_WORD',
	STARTED = 'STARTED',
	STOPPED = 'STOPPED'
}

/**
 * Structure of the Gamestate
 */
export type GameProps = {
	currentMasterID: string;
	codeWordHash: string;
	currentRound: number;
	rounds: number;
	state: GameStates;
	time: number;
};

type GameModelType = {
	key: string;
	value: any;
}; // key value Map

export class GameModel extends Subject<GameModelType> {
	/**
	 * @type {YMap<any>}
	 * since Y.Map cannot be used as a type for intellisense
	 * creating an instance works then with intellisense 
	 */
	private _map = new YMap<any>();

	constructor(map) {
		super();
		this._map = map;
		if (!this._map.doc) {
			throw Error('The map of Class GameModel does not belong to an Doc!');
		}

		this._map.observe(this._observer);
	}

	private _observer = (event, Transaction) => {
		event.keysChanged.forEach((key) => {
			const value = this._map.get(key);
			this.next({ key, value });
		});
	};

	dispose() {
		this._map.unobserve(this._observer);
	}

	setProps(props: GameProps) {
		// when an instance of this class exist, then doc exists
		// therefore transact exists
		if (this._map.doc) {
			this._map.doc.transact(() => {
				this._setProps(props);
			});
		} else {
			this._setProps(props);
		}
	}

	private _setProps(props: GameProps) {
		this.currentMasterID = props.currentMasterID;
		this.currentRound = props.currentRound || 1;
		this.rounds = props.rounds;
		this.codeWordHash = props.codeWordHash;
		this.state = props.state;
		this.time = props.time;
	}

	/**
     * Getter currentMasterID
     * @return {string}
     */
	public get currentMasterID(): string {
		return this._map.get('currentMasterID');
	}

	get time(): number {
		return this._map.get('time');
	}

	set time(value: number) {
		this._map.set('time', value);
	}
	/**
     * Getter currentRound
     * @return {number}
     */
	public get currentRound(): number {
		return this._map.get('currentRound');
	}

	/**
     * Getter rounds
     * @return {number}
     */
	public get rounds(): number {
		return this._map.get('rounds');
	}

	/**
     * Getter codeWordHash
     * @return {string}
     */
	public get codeWordHash(): string {
		return this._map.get('codeWordHash');
	}

	/**
     * Getter state
     * @return {GameStates}
     */
	public get state(): GameStates {
		return this._map.get('state') as GameStates;
	}

	/**
     * Setter currentMasterID
     * @param {string} value
     */
	public set currentMasterID(value: string) {
		this._map.set('currentMasterID', value);
	}

	/**
     * Setter currentRound
     * @param {number} value
     */
	public set currentRound(value: number) {
		this._map.set('currentRound', value);
	}

	/**
     * Setter rounds
     * @param {number} value
     */
	public set rounds(value: number) {
		this._map.set('rounds', value);
	}

	/**
     * Setter codeWordHash
     * @param {string} value
     */
	public set codeWordHash(value: string) {
		this._map.set('codeWordHash', sha256(value));
	}

	/**
     * Setter state
     * @param {GameStates} value
     */
	public set state(value: GameStates) {
		this._map.set('state', value);
	}
}
