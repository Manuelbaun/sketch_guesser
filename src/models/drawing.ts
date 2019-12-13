// Relative position between 0..1

export type Coordinate = {
	x: number;
	y: number;
};

/**
 * x, y coordinate
 */
export type Coordinate2 = [number, number];

// refactor the origin out!
export type DrawingPath = {
	color: string;
	origin: Coordinate;
	line: Array<Coordinate>;
};
