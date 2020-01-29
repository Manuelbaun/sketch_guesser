import React, { useEffect } from 'react';
import { CountDown, MessageBox, DrawingArea, MessageManager, DrawingManager } from '../../ui-components';

import { CacheStoreInterface } from '../../service';
import { GameService } from '../../components/game/game.service';

type Props = {
	service: GameService;
	store: CacheStoreInterface;
};

export const Game = ({ service, store }: Props) => {
	const drawingManager: DrawingManager = new DrawingManager(store);
	const messageManager: MessageManager = new MessageManager(store);

	useEffect(
		() => {
			console.log('Create Game');
			// clean up!!
			return (): void => {
				drawingManager.dispose();
				messageManager.dispose();
			};
		},
		[ drawingManager, messageManager ]
	);

	return (
		<div>
			<div className="App-Message">
				<CountDown gameEngine={service} />
				<MessageBox messageEngine={messageManager} />
			</div>

			<div className="App-Drawing">
				<DrawingArea drawingManager={drawingManager} width={1000} height={500} />
			</div>
		</div>
	);
};
