import * as Y from 'yjs';
import { Subject } from 'rxjs';
import { DrawingPath, Coordinate } from '../../models';
import { CacheStore } from '../../service/storage';

export default class DrawEngine extends Subject<DrawingPath[]> {
	private _drawPathStore;
	private currentDrawElement;
	private currentDrawPath;

	constructor(store: CacheStore) {
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
