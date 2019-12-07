import React, { useRef, useEffect } from 'react';

import Graph from 'p2p-graph';
import P2PGraphEngine from './p2pGraph.engine';

interface P2PGraphInterface {
	engine: P2PGraphEngine;
}

const P2PGraph: React.FC<P2PGraphInterface> = ({ engine }) => {
	const el = useRef(null);

	useEffect(() => engine.createGraph(el), [ el ]);

	return <div ref={el} />;
};

export default P2PGraph;
