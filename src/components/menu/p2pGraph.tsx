import React, { useRef, useEffect } from 'react';
import P2PGraphEngine from './p2pGraph.engine';
import { CommunicationServiceInterface } from '../../service/communication/communication.type';

interface P2PGraphInterface {
	comm: CommunicationServiceInterface;
}

const P2PGraph: React.FC<P2PGraphInterface> = ({ comm }) => {
	const el = useRef(null);

	useEffect(
		() => {
			const engine = new P2PGraphEngine(comm);
			engine.createGraph(el);
		},
		[ el ]
	);

	return <div ref={el} />;
};

export default P2PGraph;
