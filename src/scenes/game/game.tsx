import React, { useContext } from 'react';
import { CountDown, MessageBox, DrawingArea } from '../../ui-components';
import { AppContext } from '../../App';

export const Game = (props) => {
	const { service: { drawingService } } = useContext(AppContext);
	return (
		<div>
			<div className="App-Message">
				<CountDown />
				<MessageBox />
			</div>

			<div className="App-Drawing">
				<DrawingArea service={drawingService} width={1000} height={500} />
			</div>
		</div>
	);
};
