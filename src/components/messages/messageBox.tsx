import React, { useState, useEffect, useCallback } from 'react';
import MessageRow from './messageRow';
import Message from '../../models/message';

import MessageInput from './messageInput';
import './message.css';
import MessageService from '../../service/message.service';

interface MessageListProps {
	messageService: MessageService;
	localUserName: string;
}

// - get local user to check
const MessageBox: React.FC<MessageListProps> = ({ messageService, localUserName }) => {
	const [ messageList, setMessageList ] = useState(messageService.getMessages());

	// subscribe to message
	useEffect(() => {
		const sub = messageService.subscribe((messages: Message[]) => {
			setMessageList(messages);
		});

		// unsubscribe when component is destroyed
		return () => sub.unsubscribe();
	}, []);

	return (
		<div>
			<MessageInput onSubmit={(msg) => messageService.sendMessage(msg)} />
			<div className="message-container">
				<div style={{ backgroundColor: '#343a40' }}>
					{messageList.map((message) => {
						return MessageRow(message, message.user !== localUserName);
					})}
				</div>
			</div>
		</div>
	);
};

export default MessageBox;
