export interface Player {
	id: string;
	name: string;
	points: number;
}

export default class PlayerClass implements Player {
	constructor(id: string) {
		this._id = id;
	}

	private _name: string;
	public get name(): string {
		return this._name;
	}
	public set name(value: string) {
		this._name = value;
	}

	private _id: string;
	public get id(): string {
		return this._id;
	}
	public set id(value: string) {
		this._id = value;
	}

	private _points: number;
	public get points(): number {
		return this._points;
	}
	public set points(value: number) {
		this._points = value;
	}
	public addPoints(value: number) {
		this._points += value;
	}
}
