import React, { useRef, useEffect } from 'react';

import Graph from 'p2p-graph';
import P2PGraphEngine from './p2pGraph.engine';

interface P2PGraphInterface {
	engine: P2PGraphEngine;
}

const P2PGraph: React.FC<P2PGraphInterface> = ({ engine }) => {
	const el = useRef(null);
	var graph;

	useEffect(
		() => {
			graph = new Graph(el.current);
			graph.on('select', function(id) {
				// console.log(id + ' selected!');
			});
			graph.add({
				id: 'local',
				me: true,
				name: 'You'
			});

			engine.onPeerConnected = (peer) => {
				// Add two peers
				graph.add({
					id: peer,
					name: peer
				});
				graph.connect('local', peer);
			};

			engine.onPeerDisconnected = (peer) => {
				// Add two peers
				graph.disconnect('local', peer);
			};
		},
		[ el ]
	);

	return <div ref={el} />;
};

export default P2PGraph;
