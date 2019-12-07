import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import P2PGraph from './p2pGraph';
import Input from '../../commonComponents/input';
import { CommunicationServiceInterface } from '../../service/communication/communication.type';

interface MenuInterface {
	onStartGame: Function;
	comm: CommunicationServiceInterface;
}

const Menu: React.FC<MenuInterface> = (props) => {
	const [ userName, setUserName ] = useState('');

	const handleSubmit = (msg: string) => {
		setUserName(msg);
	};

	return (
		<div className="manu">
			<Input
				onSubmit={(msg) => handleSubmit(msg)}
				options={{ placeholder: 'your name', label: 'Alias', buttonLabel: 'Submit' }}
			/>
			<Button onClick={() => props.onStartGame()}> START </Button>
			<P2PGraph comm={props.comm} />
		</div>
	);
};

export default Menu;
