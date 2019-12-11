export interface GraphNode {
	id: string;
	name?: string;
	color?: string;
	size?: number;
	x?: number;
	y?: number;
	points: number;
	svg?: string;
}

export interface GraphLink {
	source: string;
	target: string;
}
