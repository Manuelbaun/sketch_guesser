import * as Y from 'yjs';
import { Coordinate } from './types';
import { Subject } from 'rxjs/internal/Subject';

interface DrawPath {
	color: string;
	origin: Coordinate;
	path: Array<Coordinate>;
}

interface DrawingStateInterface {
	store: any;
}

// const obj = { p: new DrawingPath({ color, origin: { x: 0, y: 0 } }) };
// store.push([ obj ]);
// const arr = store.toArray();
// const path = arr[0].p;
// console.log(path);
const requestAnimationFrame = window.requestAnimationFrame || setTimeout;

export default class DrawingEngine extends Subject<DrawPath[]> {
	store = new Y.Array<DrawPath>();

	constructor(props: DrawingStateInterface) {
		super();
		this.store = props.store;
		this.store.observeDeep(() => {
			this.needToRedraw = true;
			const last = this.store[this.store.length];

			this.next(this.store.toArray());
		});
	}

	// Overwrite!!
	drawFunction: FrameRequestCallback;

	needToRedraw = false;
	currentDrawElement;
	currentDrawPath;

	// FIX: Sadly a class cant be pushed to a Y.Array,
	// except wrapped with an object => Sync behavior unknown so far?
	addNewPath(origin: Coordinate, color: string) {
		this.currentDrawElement = new Y.Map();
		this.currentDrawElement.set('color', color);
		this.currentDrawElement.set('origin', origin);

		this.currentDrawPath = new Y.Array();
		this.currentDrawElement.set('path', this.currentDrawPath);

		this.store.push([ this.currentDrawElement ]);
	}

	appendCoordinates(coordinates: Coordinate) {
		if (!this.currentDrawPath) return;
		this.currentDrawPath.push([ coordinates ]);
	}

	getElement(index: number) {
		const path = this.store.get(index) as any;
		if (!path) return;

		return {
			color: path.get('color'),
			origin: path.get('origin'),
			// @ts-ignore
			path: path.get('path').toArray()
		};
	}

	clearPaths() {
		this.store.delete(0, this.store.length);
	}
}
