import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import { Input } from '../../ui-components/common/input';
import mySvg from '../../logo.svg';
import './landing.css';
import { AppContext } from '../../App';

export const LandingScene: React.FC = (prop) => {
	const { service } = useContext(AppContext);
	const createGame = (): void => service.enterGame();
	const joinGame = (roomID: string): void => service.enterGame(roomID);

	return (
		<div className="landing-page">
			<div className="header">
				<img src={mySvg} height={200} width={200} alt="Sketchguessr LOGO" />
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
