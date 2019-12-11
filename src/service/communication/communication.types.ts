import { Subject } from 'rxjs';

// TODO: This can be now changed
export enum DataTypes {
	DOC_STATE = 'DOC_STATE',
	DRAW = 'DRAW',
	MESSAGE = 'MESSAGE',
	GAME = 'GAME'
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

export interface CommunicationServiceInterface {
	localID: string;
	sendDataAll(data: Data): void;
	sendDataToID(id: string, data: Data);
}
