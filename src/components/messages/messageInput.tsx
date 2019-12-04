import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

interface MessageInputInterface {
	onSubmit(msg: string): void;
}

const MessageInput: React.FC<MessageInputInterface> = (props) => {
	const [ word, setWord ] = useState('');

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		props.onSubmit(word);
		setWord('');
	};

	const handleChange = (event) => {
		event.preventDefault();
		setWord(event.target.value);
	};

	return (
		<Form onSubmit={handleSubmit}>
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
				<Button variant="dark" type="submit" disabled={word.length === 0}>
					{' '}
					send{' '}
				</Button>
			</InputGroup>
		</Form>
	);
};

export default MessageInput;
