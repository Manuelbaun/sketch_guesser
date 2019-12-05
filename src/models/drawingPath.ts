import * as Y from 'yjs';

// Relative position between 0..1
type Coordinate = {
	x: number;
	y: number;
};

interface DrawingPathInterface {
	color: string;
	origin: Coordinate;
}

export default class DrawingPath {
	element = new Y.Map();
	currentPath;

	constructor(props: DrawingPathInterface) {
		this.element.set('color', props.color);
		this.element.set('origin', props.origin);
		this.element.set('type', 'path');
		this.currentPath = new Y.Array();
		this.element.set('path', this.currentPath);
	}

	/** @type {Y.Array<Coordinate>} */
	public get path() {
		return this.element.get('path') as Array<Coordinate>;
	}

	public addCoordinate(coordinate: Coordinate) {
		this.currentPath.push([ coordinate ]);
	}

	public clearPath() {
		this.currentPath = null;
	}

	/** @type {Coordinate} */
	public get origin() {
		return this.element.get('origin') as Coordinate;
	}

	public get color() {
		return this.element.get('color') as string;
	}
}
