import React, { useState, useEffect, useContext } from 'react';
import { Input } from '../common';
import { MessageRow } from './message_row';
import { Message } from '../../components/messages';
import { AppContext } from '../../App';
import './message.css';

// - get local user to check
export const MessageBox: React.FC = (props) => {
	const { service: { messageService } } = useContext(AppContext);

	const [ messages, setMessages ] = useState(messageService.allMessages);
	useEffect(
		() => {
			// subscribe to message updates
			const sub = messageService.subject.subscribe((messages: Message[]) => {
				setMessages(messages);
			});
			// unsubscribe when component is destroyed
			return (): void => sub.unsubscribe();
		},
		[ messageService ]
	);

	return (
		<div>
			<Input
				onSubmit={(msg): void => messageService.sendMessage(msg)}
				options={{ placeholder: 'your guess here', label: 'Guess', buttonLabel: 'Send' }}
			/>
			<div className="message-container">
				<div style={{ backgroundColor: '#343a40' }}>
					{messages.map((message) => {
						const key = `${message.ts}-${message.id}`;
						const local = messageService.isLocal(message.id);
						return <MessageRow key={key} message={message} local={local} />;
					})}
				</div>
			</div>
		</div>
	);
};
