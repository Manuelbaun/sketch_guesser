import * as Y from 'yjs';
import { Coordinate, DrawPath } from '../components/drawing/types';
import { Subject } from 'rxjs/internal/Subject';

// const requestAnimationFrame = window.requestAnimationFrame || setTimeout;

export default class DrawEngine extends Subject<DrawPath[]> {
	yDoc = new Y.Doc();
	store = this.yDoc.getArray<DrawPath>('drawState');

	constructor() {
		super();

		this.yDoc.on('update', (update) => {
			this.onUpdate(update);
		});

		// TODO: think again
		this.store.observeDeep(() => {
			this.next(this.store.toArray());
		});
		console.log('MessageEngine init');
	}

	// Overwrite!!
	drawFunction: FrameRequestCallback;

	currentDrawElement;
	currentDrawPath;

	applyUpdate(update) {
		Y.applyUpdate(this.yDoc, update);
	}

	onUpdate = (update: Uint8Array): void => {
		throw new Error('Please wire the onEmitGameUpdates up');
	};

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
