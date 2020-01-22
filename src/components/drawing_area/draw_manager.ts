import * as Y from 'yjs';
import { Subject } from 'rxjs';
import { DrawingPath, Coordinate } from '../../models';
import { CacheStoreInterface } from '../../service/storage';

/**
 * 
 * TODO: This manager should track which paths are already drawn to the canvas 
 * and which paths should be drawn/updated....
 * not the DrawingArea Component.
 * 
 * DrawingPath should have an ID, for better tracking
 */

export class DrawingManager extends Subject<DrawingPath[]> {
	private drawPathStore;
	private currentDrawElement;
	private currentDrawPath;

	constructor(cache: CacheStoreInterface) {
		super();
		this.drawPathStore = cache.drawPaths;

		this.drawPathStore.observeDeep(() => {
			const arr3 = this.drawPathStore.map((path) => path.toJSON()) as Array<DrawingPath>;

			// emit to listener (Drawing Area)
			this.next(arr3);
		});

		console.log('MessageEngine init');
	}

	// Classes cant be pushed into an array, it will just be an json object
	addNewPath(origin: Coordinate, color: string): void {
		this.currentDrawElement = new Y.Map();
		this.currentDrawElement.set('color', color);
		this.currentDrawElement.set('origin', origin);
		this.currentDrawPath = new Y.Array();
		this.currentDrawElement.set('line', this.currentDrawPath);

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
			line: path.get('line').toArray()
		} as DrawingPath;
	}

	clearPaths(): void {
		this.drawPathStore.delete(0, this.drawPathStore.length);
	}
}
