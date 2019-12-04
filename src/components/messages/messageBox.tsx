import React, { useCallback, useEffect, useRef, useState } from 'react';
import MessageRow from './messageRow';
import Message from './message.interface';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './message.css'
import MessageInput from './messageInput';
import Table from 'react-bootstrap/Table';

interface MessageListProps {
    list: Array<Message>
}

// TODO: header
const MessageBox: React.FC<MessageListProps> = ({ list }) => {

    if (list.length > 0) {
        return <div className="message-container" >
            <MessageInput />
            <Table striped bordered hover variant="dark" size="lg" responsive >
                <thead className="header" style={{ fontSize: "1.2rem" }}>
                    <tr>
                        <th>Time</th>
                        <th>USER</th>
                        <th>MESSAGE</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: "1.2rem" }}>
                    {list.map(message => {
                        return MessageRow(message)
                    })}
                </tbody>
            </Table>
        </div >
    } else {
        return <div>No message found</div>
    }
}



export default MessageBox;