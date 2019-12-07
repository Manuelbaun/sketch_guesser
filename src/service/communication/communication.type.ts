import { Subject } from 'rxjs';

export enum DataTypes {
	DOC_STATE,
	DRAW,
	MESSAGE,
	GAME,
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
	sendDataAll(data: Data): void;
	sendDataToID(id: string, data: Data);
	connectionStream: Subject<ConnectionData>;
	dataStream: Subject<Data>;
}
