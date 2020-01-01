// Relative position between 0..1

export type Coordinate = {
	x: number;
	y: number;
};

// refactor the origin out!
export type DrawingPath = {
	color: string;
	origin: Coordinate;
	line: Array<Coordinate>;
};
