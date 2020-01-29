import React from 'react';
import Button from 'react-bootstrap/Button';
import { Input } from '../../ui-components/common/input';
import mySvg from '../../logo.svg';
import './landing.css';
import { AppService } from '../../service';

type Props = {
	service: AppService;
};

export const LandingScene: React.FC<Props> = ({ service }) => {
	const createGame = (): void => service.startGame();
	const joinGame = (roomID: string): void => service.startGame(roomID);

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
