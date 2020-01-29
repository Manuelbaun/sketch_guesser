import * as Y from 'yjs';
import { DrawingStorePort } from './drawing.store.port';
import { CacheStoreSyncInterface } from '../../service';
import { DRAW_STORE_NAME, DrawingPath, Coordinate } from './drawing.model';

export class DrawingStoreAdapter implements DrawingStorePort {
	store = new Y.Array<any>();
	private currentDrawElement = new Y.Map<any>();
	private currentDrawPath = new Y.Array<Coordinate>();

	constructor(store: CacheStoreSyncInterface) {
		this.store = store.yDoc.getArray(DRAW_STORE_NAME);
		this.store.observeDeep(this.observer);
	}

	dispose(): void {
		this.store.unobserveDeep(this.observer);
	}

	observer = (event?: any, trans?: any): void => {
		// @ts-ignore
		const paths = this.store.map((path) => path.toJSON()) as Array<DrawingPath>;

		this._onUpdateHandler(paths);
	};

	addNewPath(color: string, origin: Coordinate): void {
		this.currentDrawElement = new Y.Map<DrawingPath>();
		this.currentDrawElement.set('color', color);
		this.currentDrawElement.set('origin', origin);
		this.currentDrawPath = new Y.Array<Coordinate>();
		this.currentDrawElement.set('line', this.currentDrawPath);
		this.store.push([ this.currentDrawElement ]);
	}

	appendToCurrentPath(coordinates: Coordinate): void {
		if (!this.currentDrawPath) return;
		this.currentDrawPath.push([ coordinates ]);
	}

	onUpdate(handler: (values: DrawingPath[]) => void): void {
		this._onUpdateHandler = handler;
	}

	_onUpdateHandler = (values: DrawingPath[]): void => {
		throw Error('Please Override me');
	};

	clearStore(): void {
		this.store.delete(0, this.store.length);
	}
}
