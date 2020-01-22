import * as Y from 'yjs';

export type Player = {
	id: string;
	name: string;
	clientId: number;
	points: number;
	online: boolean;
	x: number; // between 0 and 1 => normalized
	y: number; // between 0 and 1
};

type PlayerProps = {
	id: string;
	name?: string;
	points?: number;
	x?: number; // between 0 and 1 => normalized
	y?: number; // between 0 and 1
};

export class PlayerClass extends Y.Map<any> {
	_id: string = '';

	constructor(props: PlayerProps) {
		super();

		this._id = props.id;
		this.set('id', props.id);
		this.name = props.name || props.id;
		this.x = props.x || 0.5;
		this.y = props.y || 0.5;
		this.points = props.points || 0;
	}

	public get name(): string {
		return this.get('name') as string;
	}
	public set name(name: string) {
		this.set('name', name);
	}

	public get x() {
		return this.get('x');
	}
	public set x(value: number) {
		this.set('x', value);
	}

	public get id(): string {
		return this._id;
	}
	public get y(): number {
		return this.get('y') as number;
	}
	public set y(value: number) {
		this.set('y', value);
	}

	public get points(): number {
		return this.get('points') as number;
	}
	public set points(value: number) {
		this.set('points', value);
	}
}
