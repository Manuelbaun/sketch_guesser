export enum DocUpdateTypes {
	DRAW,
	MESSAGE,
	GAME
}

export type DocUpdate = {
	type: DocUpdateTypes;
	payload: ArrayBuffer | Uint8Array;
};

export interface EngineInterface {
	applyUpdate(update: DocUpdate);
	onUpdate(update: DocUpdate): void;
}
