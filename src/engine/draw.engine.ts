import * as Y from 'yjs';
import { Coordinate, DrawPath } from '../components/drawing/types';
import { Subject } from 'rxjs/internal/Subject';
import { EngineInterface } from '../interfaces/engine.interface';
import { Data, DataTypes } from '../service/communication/communication.type';

// const requestAnimationFrame = window.requestAnimationFrame || setTimeout;

export default class DrawEngine extends Subject<DrawPath[]> implements EngineInterface {
	private yDoc = new Y.Doc();
	private _drawPathStore = this.yDoc.getArray<DrawPath>('drawState');

	constructor() {
		super();

		this.yDoc.on('update', (update) => {
			const docUpdate: Data = {
				type: DataTypes.DRAW,
				payload: update
			};
			this.onUpdate(docUpdate);
		});

		// TODO: think again
		this._drawPathStore.observeDeep(() => {
			this.next(this._drawPathStore.toArray());
		});
		console.log('MessageEngine init');
	}

	currentDrawElement;
	currentDrawPath;

	applyUpdate(update: Uint8Array) {
		Y.applyUpdate(this.yDoc, update);
	}

	onUpdate = (update: Data): void => {
		throw new Error('Please wire the onUpdate up');
	};

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
			// @ts-ignore
			path: path.get('path').toArray()
		};
	}

	clearPaths() {
		this._drawPathStore.delete(0, this._drawPathStore.length);
	}
}
