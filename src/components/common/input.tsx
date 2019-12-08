import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

interface InputOptions {
	placeholder?: string;
	label?: string;
	buttonLabel?: string;
}

interface InputInterface {
	onSubmit(msg: string): void;
	options: InputOptions;
}

const Input: React.FC<InputInterface> = ({ onSubmit, options }) => {
	const [ text, setText ] = useState('');

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit(text);
		setText('');
	};

	const handleChange = (event) => {
		event.preventDefault();
		setText(event.target.value);
	};

	return (
		<Form onSubmit={handleSubmit}>
			<InputGroup className="mb-3">
				<InputGroup.Prepend>
					<InputGroup.Text id="basic-addon1">Guess</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl
					placeholder={options.placeholder}
					aria-label={options.label}
					value={text}
					aria-describedby="basic-addon1"
					onChange={handleChange}
				/>
				<Button variant="dark" type="submit" disabled={text.length === 0}>
					{options.buttonLabel}
				</Button>
			</InputGroup>
		</Form>
	);
};

Input.defaultProps = {
	onSubmit: () => {},
	options: {
		placeholder: 'placeholder',
		buttonLabel: 'PushMe',
		label: 'Explain'
	}
};

export default Input;
