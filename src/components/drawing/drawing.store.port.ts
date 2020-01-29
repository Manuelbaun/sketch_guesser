import { DrawingPath, Coordinate } from './drawing.model';

export interface DrawingStorePort {
	addNewPath(color: string, origin: Coordinate): void;
	appendToCurrentPath(coordinates: Coordinate): void;
	onUpdate(handler: (values: DrawingPath[]) => void);
	clearStore(): void;
	dispose();
}
