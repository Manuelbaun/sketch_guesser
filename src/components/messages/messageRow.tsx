import React from 'react';
import Message from './message.interface';

import './message.css';

function addZero(t: number | string) {
	if (t < 10) t = '0' + t;
	return t;
}
interface MessageRowInterface extends Message {
	incoming: boolean;
}

const MessageRow = (props: Message, incoming: boolean) => {
	var h = props.time.getHours();
	var m = addZero(props.time.getMinutes());
	var s = addZero(props.time.getSeconds());

	if (h > 12) h -= 12;
	else if (h === 0) h = 12;

	const layoutClass = incoming ? 'incoming' : 'outgoing';

	return (
		<div className="box-wrapper" key={props.time.getTime().toString() + props.user}>
			<div className={'box ' + layoutClass}>
				<div className="message-details">
					<span>
						{h}:{m}:{s}{' '}
					</span>{' '}
					--
					<span> {props.user} </span>
				</div>
				<div>{props.message}</div>
			</div>
		</div>
	);
};

export default MessageRow;
