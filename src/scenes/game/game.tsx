import React, { useEffect } from 'react';
import { CountDown, MessageBox, DrawingArea } from '../../ui-components';

import { GameService } from '../../components/game/game.service';
import { MessageService, MessageStoreAdapter } from '../../components/messages';
import { DrawingService, DrawingStoreAdapter } from '../../components/drawing';
import { CacheStoreSyncInterface } from '../../service';

type Props = {
	gameService: GameService;
	store: CacheStoreSyncInterface;
};

export const Game = ({ gameService, store }: Props) => {
	const messageStoreAdapter = new MessageStoreAdapter(store);
	const drawingStoreAdapter = new DrawingStoreAdapter(store);
	const messageService = new MessageService(messageStoreAdapter);
	const drawingService = new DrawingService(drawingStoreAdapter);

	useEffect(() => {
		console.log('Clean Up Game ');
		return (): void => {
			messageService.dispose();
			drawingService.dispose();
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
