import React, { useState, useEffect } from 'react';
import { MessageRow } from './message_row';
import { Message } from '../../models';
import { MessageEngine } from './message.engine';
import { Input } from '../common';
import './message.css';

type MessageBoxProps = {
	messageEngine: MessageEngine;
};

// - get local user to check
export const MessageBox: React.FC<MessageBoxProps> = ({ messageEngine }) => {
	const [ messageList, setMessageList ] = useState(messageEngine.getMessages());

	// subscribe to message
	useEffect(
		() => {
			const sub = messageEngine.subscribe((messages: Message[]) => {
				setMessageList(messages);
			});

			// unsubscribe when component is destroyed
			return () => sub.unsubscribe();
		},
		[ messageEngine ]
	);

	return (
		<div>
			<Input
				onSubmit={(msg) => messageEngine.sendMessage(msg)}
				options={{ placeholder: 'your guess here', label: 'Guess', buttonLabel: 'Send' }}
			/>
			<div className="message-container">
				<div style={{ backgroundColor: '#343a40' }}>
					{messageList.map((message) => {
						const local = message.id !== messageEngine.localID;

						const key = message.ts.toString() + messageEngine.localName;

						return <MessageRow key={key} message={message} incoming={local} />;
					})}
				</div>
			</div>
		</div>
	);
};
