export interface DrawingPath {
	color: string;
	origin: Coordinate;
	path: Array<Coordinate>;
}

// Relative position between 0..1
export type Coordinate = {
	x: number;
	y: number;
};
