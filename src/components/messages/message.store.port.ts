import { Message } from './message.model';

export interface MessageStorePort {
	add(msg: Message): void;
	onUpdate(handler: (messages: Array<Message>) => void);
	clearStore(): void;
	dispose();
}
