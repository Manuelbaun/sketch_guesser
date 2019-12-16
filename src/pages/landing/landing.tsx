import React, { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import './landing.css';
import { Input } from '../../components/common/input';
import mySvg from '../../logo.svg';

type Props = {
	onJoinGame(roomID: string): void;
	onCreateGame(): void;
};

export const LandingPage = (props: Props) => {
	const joinGame = (roomID: string) => {
		props.onJoinGame(roomID);
	};

	const createGame = () => {
		props.onCreateGame();
	};

	return (
		<div className="landing-page">
			<div className="header" >
				<img src={mySvg} />
			</div>
			<h1>Welcome to SketchGuessr</h1>

			<Button className={'join-button'} variant="success" onClick={createGame}>
				Create new Game{' '}
			</Button>

			<div>
				<Input
					onSubmit={joinGame}
					options={{
						buttonLabel: 'Join',
						label: 'RoomID',
						placeholder: 'do you know a room?'
					}}
				/>
			</div>
		</div>
	);
};
