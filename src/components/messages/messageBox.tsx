import React, { useCallback, useEffect, useRef, useState } from 'react';
import MessageRow from './messageRow';
import Message from './message.interface';


import MessageInput from './messageInput';
import Table from 'react-bootstrap/Table';
import './message.css'

interface MessageListProps {
    list: Array<Message>
}

// TODO: header
// - get local user to check
const MessageBox: React.FC<MessageListProps> = ({ list }) => {

    if (list.length > 0) {
        return <div className="message-container" >
            <MessageInput />
            <div style={{ backgroundColor: '#343a40' }} >
                {list.map(message => {
                    return MessageRow(message, message.user != "Hans Klaus")
                })}
            </div>
        </div >
    } else {
        return <div>No message found</div>
    }
}



export default MessageBox;