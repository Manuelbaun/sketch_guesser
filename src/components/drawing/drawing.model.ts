export type Coordinate = {
	x: number;
	y: number;
};
// refactor the origin out!
export type DrawingPath = {
	color: string;
	// x, y relative position 0-1
	origin: Coordinate;
	// x, y relative position 0-1
	line: Array<Coordinate>;
};

export type DrawingPathKeys = keyof DrawingPath;
export const DRAW_STORE_NAME = 'drawing';
