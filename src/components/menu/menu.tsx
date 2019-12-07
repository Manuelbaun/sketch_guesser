import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import P2PGraph from './p2pGraph';
import P2PGraphEngine from './p2pGraph.engine';
import Input from '../../commonComponents/input';

interface MenuInterface {
	onStartGame: Function;
	p2pGraphEngine: P2PGraphEngine;
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
			<P2PGraph engine={props.p2pGraphEngine} />
		</div>
	);
};

export default Menu;
