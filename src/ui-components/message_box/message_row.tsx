import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Message } from '../../models';

import './message.css';

function addZero(t: number | string) {
	if (t < 10) t = '0' + t;
	return t;
}

type MessageRowProps = {
	message: Message;
	incoming: boolean;
};

export const MessageRow: React.FC<MessageRowProps> = (props) => {
	const { message, incoming } = props;
	const date = new Date(message.ts);
	var h = date.getHours();
	var m = addZero(date.getMinutes());
	var s = addZero(date.getSeconds());

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
