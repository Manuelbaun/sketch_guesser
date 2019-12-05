// Relative position between 0..1
export type Coordinate = {
	x: number;
	y: number;
};

export interface DrawPath {
	color: string;
	origin: Coordinate;
	path: Array<Coordinate>;
}
