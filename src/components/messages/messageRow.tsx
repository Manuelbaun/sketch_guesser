import React, { useCallback, useEffect, useRef, useState } from 'react';
import Message from './message.interface';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function addZero(t: number | string) {
    if (t < 10) t = '0' + t;
    return t;
}

const MessageRow = (option: Message) => {
    var h = option.time.getHours();
    var m = addZero(option.time.getMinutes());
    var s = addZero(option.time.getSeconds());

    if (h > 12) h -= 12;
    else if (h === 0) h = 12;

    return (<Row key={option.time.getTime().toString() + option.user}>
        <Col xs={3} md={3} >{h}:{m}:{s}</Col>
        <Col xs={3} md={4} >{option.user}</Col>
        <Col xs={5} md={5} >{option.message} </Col>
    </Row>
    )
}

export default MessageRow;