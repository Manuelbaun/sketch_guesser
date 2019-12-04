// todo: convert to type?

export interface MessageInterface {
	time: Date;
	user: string;
	message: string;
}

export default class Message implements MessageInterface {
	constructor(obj: MessageInterface) {
		this.time = obj.time;
		this.user = obj.user;
		this.message = obj.message;
	}

	time: Date;
	user: string;
	message: string;
}
