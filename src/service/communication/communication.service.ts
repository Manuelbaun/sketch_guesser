import { Data } from './communication.type';

// should be facade
interface CommunicationServiceInterface {
	sendDataAll(data: Data): void;
	sendData(id: string, data);
	onReceiveData(data: Data);
}

// singleton
export default class CommunicationServiceImpl implements CommunicationServiceInterface {
	constructor() {}
	sendDataAll(data: Data) {}
	sendData(id: string, data) {}
	onReceiveData(data: Data) {}
}
