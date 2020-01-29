export interface Message {
	id: string;
	ts: number;
	user: string;
	message: string;
}

export type MessageStoreKey = keyof Message;

export const MESSAGES_STORE_NAME = 'messages';
