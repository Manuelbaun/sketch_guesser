import React, { useCallback, useEffect, useRef, useState } from 'react';
import MessageRow from './messageRow';
import Message from './message.interface';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './message.css'
import MessageInput from './messageInput';

interface MessageListProps {
    list: Array<Message>
}

// TODO: header
const MessageBox: React.FC<MessageListProps> = ({ list }) => {

    if (list.length > 0) {
        return <div className="message-container" >
            <Container >
                <MessageInput />
                <Row className="header">
                    <Col xs={3} md={3} >Time</Col>
                    <Col xs={3} md={4} >USER</Col>
                    <Col xs={5} md={5} >MESSAGE </Col>
                </Row>
                {list.map(message => {
                    return MessageRow(message)
                })}
            </Container >
        </div >
    } else {
        return <div>No message found</div>
    }
}



export default MessageBox;