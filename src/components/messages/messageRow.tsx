import React from 'react';
import Message from '../../models/message';

import './message.css';

function addZero(t: number | string) {
	if (t < 10) t = '0' + t;
	return t;
}

interface MessageRowProps {
	message: Message;
	incoming: boolean;
}

const MessageRow: React.FC<MessageRowProps> = (props) => {
	const { message, incoming } = props;
	var h = message.time.getHours();
	var m = addZero(message.time.getMinutes());
	var s = addZero(message.time.getSeconds());

	if (h > 12) h -= 12;
	else if (h === 0) h = 12;

	const layoutClass = incoming ? 'incoming' : 'outgoing';
	const time = `${h}:${m}:${s}`;

	return (
		<div className="box-wrapper">
			<div className={'box ' + layoutClass}>
				<div className="message-details">
					<span>{time}</span>
					--
					<span> {message.user} </span>
				</div>
				<div>{message.message}</div>
			</div>
		</div>
	);
};

export default MessageRow;
