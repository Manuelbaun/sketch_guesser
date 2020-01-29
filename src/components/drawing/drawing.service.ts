import { ServiceInterface } from '../base';
import { DrawingPath, Coordinate } from './drawing.model';
import { Subject } from 'rxjs';
import { DrawingStorePort } from './drawing.store.port';

export class DrawingService implements ServiceInterface<DrawingPath[]> {
	subject: Subject<Array<DrawingPath>> = new Subject();
	adapter: DrawingStorePort;

	constructor(adapter: DrawingStorePort) {
		this.adapter = adapter;
		this.adapter.onUpdate((paths): void => {
			this.subject.next(paths);
		});
	}

	dispose(): void {
		console.log('Dispose DrawingService');
		this.subject.complete();
		this.clearDrawing();
	}

	// Classes cant be pushed into an array, it will just be an json object
	addNewPath(origin: Coordinate, color: string): void {
		this.adapter.addNewPath(color, origin);
	}

	appendCoordinates(coordinates: Coordinate): void {
		this.adapter.appendToCurrentPath(coordinates);
	}

	clearDrawing(): void {
		this.adapter.clearStore();
	}
}
