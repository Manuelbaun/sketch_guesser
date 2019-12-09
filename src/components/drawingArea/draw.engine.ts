import * as Y from 'yjs';
import { Subject } from 'rxjs';
import { ICacheEngine } from '../../gameEngine/cache.engine';

/**
 * TODO: Is this just an Manager?
 */
// Relative position between 0..1
export type Coordinate = {
	x: number;
	y: number;
};

export interface IDrawPath {
	color: string;
	origin: Coordinate;
	path: Array<Coordinate>;
}

export default class DrawEngine extends Subject<IDrawPath[]> {
	private _drawPathStore;
	private currentDrawElement;
	private currentDrawPath;

	constructor(store: ICacheEngine) {
		super();
		this._drawPathStore = store.drawPathStore;

		// TODO: think again
		this._drawPathStore.observeDeep(() => {
			this.next(this._drawPathStore.toArray());
		});

		console.log('MessageEngine init');
	}

	// FIX: Sadly a class cant be pushed to a Y.Array,
	// it will be just an json object with no methods, when build back
	// except wrapped with an object => Sync behavior unknown so far?
	addNewPath(origin: Coordinate, color: string) {
		this.currentDrawElement = new Y.Map();
		this.currentDrawElement.set('color', color);
		this.currentDrawElement.set('origin', origin);
		this.currentDrawPath = new Y.Array();
		this.currentDrawElement.set('path', this.currentDrawPath);
		this._drawPathStore.push([ this.currentDrawElement ]);
	}

	appendCoordinates(coordinates: Coordinate) {
		if (!this.currentDrawPath) return;
		this.currentDrawPath.push([ coordinates ]);
	}

	getElement(index: number) {
		const path = this._drawPathStore.get(index) as any;
		if (!path) return;

		return {
			color: path.get('color'),
			origin: path.get('origin'),
			path: path.get('path').toArray()
		};
	}

	clearPaths() {
		this._drawPathStore.delete(0, this._drawPathStore.length);
	}
}
