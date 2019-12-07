import React, { useState, useEffect } from 'react';
import MessageRow from './messageRow';
import Message from '../../models/message';
import Input from '../../common/input';
import MessageEngine from './message.engine';
import './message.css';

interface MessageListProps {
	messageService: MessageEngine;
	localUserName: string;
}

// - get local user to check
const MessageBox: React.FC<MessageListProps> = ({ messageService, localUserName }) => {
	const [ messageList, setMessageList ] = useState(messageService.getMessages());

	// subscribe to message
	useEffect(
		() => {
			const sub = messageService.subscribe((messages: Message[]) => {
				setMessageList(messages);
			});

			// unsubscribe when component is destroyed
			return () => sub.unsubscribe();
		},
		[ messageService ]
	);

	return (
		<div>
			<Input
				onSubmit={(msg) => messageService.sendMessage(msg)}
				options={{ placeholder: 'your guess here', label: 'Guess', buttonLabel: 'Send' }}
			/>
			<div className="message-container">
				<div style={{ backgroundColor: '#343a40' }}>
					{messageList.map((message) => {
						const key = message.ts.toString() + message.user;

						return <MessageRow key={key} message={message} incoming={message.user !== localUserName} />;
					})}
				</div>
			</div>
		</div>
	);
};

export default MessageBox;
