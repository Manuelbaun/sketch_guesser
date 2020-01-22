import React, { useEffect } from 'react';
import { CountDown, MessageBox, DrawingArea, MessageManager, DrawingManager } from '../../components';
import { GameEngineInterface } from '../../engines';
import { CacheStoreInterface } from '../../service';

type Props = {
	gameEngine: GameEngineInterface;
	store: CacheStoreInterface;
};

export const GamePage = ({ gameEngine, store }: Props) => {
	let drawingManager: DrawingManager = new DrawingManager(store);
	let messageManager: MessageManager = new MessageManager(store);

	useEffect(() => {
		console.log('Create Game');
		// clean up!!
		return () => {
			drawingManager.dispose();
			messageManager.dispose();
		};
	}, []);

	return (
		<div>
			<div className="App-Message">
				<CountDown gameEngine={gameEngine} />
				<MessageBox messageEngine={messageManager} />
			</div>

			<div className="App-Drawing">
				<DrawingArea drawingManager={drawingManager} width={1000} height={500} />
			</div>
		</div>
	);
};
