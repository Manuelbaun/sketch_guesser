import React, { useCallback, useEffect, useRef, useState } from 'react';
import Message from './message.interface';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';




const MessageInput = () => {

    const [word, setWord] = useState("");

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setWord("");
    }, [word]);

    const handleChange = useCallback((event) => {
        event.preventDefault();
        console.log(event.target.value);
        setWord(event.target.value);
    }, [word]);

    return <Form onSubmit={handleSubmit}>
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Guess</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
                placeholder="your guess here"
                aria-label="Guess"
                value={word}
                aria-describedby="basic-addon1"
                onChange={handleChange}
            />
            <Button variant="primary" type="submit" disabled={word.length === 0} > send </Button>
        </InputGroup>

    </Form>


}

export default MessageInput;