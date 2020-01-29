import { Message } from './message.model';

export interface MessageStorePort {
	add(msg: Message): void;
	getCurrentContent(): Message[];
	onUpdate(handler: (messages: Array<Message>) => void);
	clearStore(): void;
	dispose();
}
