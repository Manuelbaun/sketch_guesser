import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { convertDateToString } from '../../util';
import { Message } from '../../components/messages';

import './message.css';

type Props = {
	message: Message;
	local: boolean;
};

export const MessageRow: React.FC<Props> = ({ message, local }) => {
	const time = convertDateToString(new Date(message.ts));
	const boxClass = local ? 'box outgoing' : 'box incoming';

	if (local) {
		return (
			<div className="box-wrapper">
				<Row className={boxClass}>
					<Col className="message">{message.message}</Col>
					<Col className="message-details">
						<Row className="user"> {message.user} </Row>
						<Row className="time">{time}</Row>
					</Col>
				</Row>
			</div>
		);
	} else {
		return (
			<Container className="box-wrapper">
				<Row className={boxClass}>
					<Col className="message-details">
						<Row className="user"> {message.user} </Row>
						<Row className="time">{time}</Row>
					</Col>
					<Col className="message">{message.message}</Col>
				</Row>
			</Container>
		);
	}
};
