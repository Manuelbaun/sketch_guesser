import * as Y from 'yjs';
import { Subject } from 'rxjs';
import { DrawingPath, Coordinate } from '../../models';
import { CacheStore } from '../../service/storage';

export default class DrawingManager extends Subject<DrawingPath[]> {
	private drawPathStore;
	private currentDrawElement;
	private currentDrawPath;

	constructor(store: CacheStore) {
		super();
		this.drawPathStore = store.drawPaths;

		console.log(this);
		// TODO: think again
		this.drawPathStore.observeDeep(() => {
			this.next(this.drawPathStore.toArray());
		});

		console.log('MessageEngine init');
	}

	// FIX: Sadly a class cant be pushed to a Y.Array,
	// it will be just an json object with no methods, when build back
	// except wrapped with an object => Sync behavior unknown so far?
	addNewPath(origin: Coordinate, color: string): void {
		this.currentDrawElement = new Y.Map();
		this.currentDrawElement.set('color', color);
		this.currentDrawElement.set('origin', origin);
		this.currentDrawPath = new Y.Array();
		this.currentDrawElement.set('path', this.currentDrawPath);
		this.drawPathStore.push([ this.currentDrawElement ]);
	}

	appendCoordinates(coordinates: Coordinate): void {
		if (!this.currentDrawPath) return;
		this.currentDrawPath.push([ coordinates ]);
	}

	getElement(index: number): DrawingPath | null {
		const path = this.drawPathStore.get(index);
		if (!path) return null;

		return {
			color: path.get('color'),
			origin: path.get('origin'),
			path: path.get('path').toArray()
		};
	}

	clearPaths(): void {
		this.drawPathStore.delete(0, this.drawPathStore.length);
	}
}
