import React from 'react';
import { CountDown, MessageBox, DrawingArea, DrawingManager } from '../../ui-components';

import { GameService } from '../../components/game/game.service';
import { MessageService } from '../../components/messages';

type Props = {
	gameService: GameService;
	messageService: MessageService;
	drawingService: DrawingManager;
};

export const Game = ({ gameService, messageService, drawingService }: Props) => {
	console.log(messageService, drawingService);
	return (
		<div>
			<div className="App-Message">
				<CountDown service={gameService} />
				<MessageBox service={messageService} />
			</div>

			<div className="App-Drawing">
				<DrawingArea drawingManager={drawingService} width={1000} height={500} />
			</div>
		</div>
	);
};
