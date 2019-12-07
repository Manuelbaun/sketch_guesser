import { Data } from '../service/communication/communication.type';

export interface EngineInterface {
	applyUpdate(update: Uint8Array);
	onUpdate(update: Data): void;
}
