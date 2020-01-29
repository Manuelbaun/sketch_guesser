import React, { useState, useEffect } from 'react';
import { Input } from '../common';
import { MessageService, Message } from '../../components/messages';
import { MessageRow } from './message_row';
import './message.css';

type Props = {
	service: MessageService;
};

// - get local user to check
export const MessageBox: React.FC<Props> = ({ service }) => {
	const [ messages, setMessages ] = useState(service.allMessages);
	useEffect(
		() => {
			// subscribe to message updates
			const sub = service.subject.subscribe((messages: Message[]) => {
				setMessages(messages);
			});
			// unsubscribe when component is destroyed
			return (): void => sub.unsubscribe();
		},
		[ service ]
	);

	return (
		<div>
			<Input
				onSubmit={(msg): void => service.sendMessage(msg)}
				options={{ placeholder: 'your guess here', label: 'Guess', buttonLabel: 'Send' }}
			/>
			<div className="message-container">
				<div style={{ backgroundColor: '#343a40' }}>
					{messages.map((message) => {
						const key = `${message.ts}-${message.id}`;
						const local = service.isLocal(message.id);
						return <MessageRow key={key} message={message} local={local} />;
					})}
				</div>
			</div>
		</div>
	);
};
