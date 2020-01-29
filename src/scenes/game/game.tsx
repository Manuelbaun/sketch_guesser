import React, { useEffect } from 'react';
import { CountDown, MessageBox, DrawingArea } from '../../ui-components';

import { GameService } from '../../components/game/game.service';
import { MessageService, MessageStorePort } from '../../components/messages';
import { DrawingService, DrawingStorePort } from '../../components/drawing';

type Props = {
	gameService: GameService;
	messageStoreAdapter: MessageStorePort;
	drawingStoreAdapter: DrawingStorePort;
};

export const Game = ({ gameService, messageStoreAdapter, drawingStoreAdapter }: Props) => {
	const messageService = new MessageService(messageStoreAdapter);
	const drawingService = new DrawingService(drawingStoreAdapter);

	useEffect(() => {
		console.log('Start Game ');
		return (): void => {
			console.log('Clean Up Game ');

			drawingStoreAdapter.dispose();
			messageStoreAdapter.dispose();
		};
	}, []);

	console.log(messageService, drawingService);
	return (
		<div>
			<div className="App-Message">
				<CountDown service={gameService} />
				<MessageBox service={messageService} />
			</div>

			<div className="App-Drawing">
				<DrawingArea service={drawingService} width={1000} height={500} />
			</div>
		</div>
	);
};
