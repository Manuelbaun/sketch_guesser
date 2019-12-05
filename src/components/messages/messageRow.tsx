import React from 'react';
import Message from '../../models/message';

import './message.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

	const time = `${h}:${m}:${s}`;

	if (incoming) {
		return (
			<Container className="box-wrapper">
				<Row className={'box incoming'}>
					<Col className="message-details">
						<Row className="user"> {message.user} </Row>
						<Row className="time">{time}</Row>
					</Col>
					<Col className="message">{message.message}</Col>
				</Row>
			</Container>
		);
	} else {
		return (
			<div className="box-wrapper">
				{/* class outgoing is !important */}
				<Row className={'box outgoing'}>
					<Col className="message">{message.message}</Col>
					<Col className="message-details">
						<Row className="user"> {message.user} </Row>
						<Row className="time">{time}</Row>
					</Col>
				</Row>
			</div>
		);
	}
};

export default MessageRow;
