export enum DataTypes {
	DRAW,
	MESSAGE,
	GAME
}

export interface DataRaw {
	type: DataTypes;
	payload: ArrayBuffer;
}

export interface Data {
	type: DataTypes;
	payload: Uint8Array;
}

export enum ConnectionEventType {
	OPEN = 'OPEN',
	CLOSE = 'CLOSE'
}

export interface ConnectionData {
	type: ConnectionEventType;
	peerID: string;
}
