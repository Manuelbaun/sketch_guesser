import React, { useEffect, useState } from 'react';

import PlayerEngine from '../../engine/player.engine';
import { Graph } from 'react-d3-graph';

import './p2pGraph.css';

var chance = require('chance')('static');

interface P2PGraphInterface {
	engine: PlayerEngine;
}

interface D3Node {
	id: string;
	name?: string;
	color?: string;
	size?: number;
	x?: number;
	y?: number;
}

interface D3Link {
	source: string;
	target: string;
}

const P2PGraph: React.FC<P2PGraphInterface> = ({ engine }) => {
	const selfNode = {
		id: engine.localID,
		name: 'You',
		color: '#e6194B',
		x: window.innerWidth / 2,
		y: window.innerWidth / 4
	};
	const [ nodes, setNodes ] = useState<Array<D3Node>>([ selfNode ]);
	const [ links, setLinks ] = useState<Array<D3Link>>([]);

	const [ width, setWidth ] = useState(window.innerWidth - 50);
	const [ height, setHeight ] = useState(window.innerWidth / 2);

	const updateNodes = () => {
		const nodesArr: Array<D3Node> = [];
		const linksArr: Array<D3Link> = [];

		const arcSec = 2 * Math.PI / engine.playerNum;
		// console.log('Current Players', engine.playerNum);
		let counter = 1;
		engine.playerDoc.forEach((value, key) => console.log(value, key));
		engine.playerDoc.forEach((value, key) => {
			const self = engine.localID === key;

			if (self) {
				nodesArr.push({
					id: engine.localID,
					color: '#e6194B',
					name: value.name === engine.localID ? 'You' : value.name + ' (You)',
					x: window.innerWidth / 2,
					y: window.innerWidth / 4
				});
			} else {
				const x = width / 2 + Math.sin(arcSec * counter) * 100;
				const y = height / 2 + Math.cos(arcSec * counter) * 100;

				nodesArr.push({
					id: key,
					name: value.name,
					color: self ? '#e6194B' : '#911eb4',
					size: self ? 800 : 450,
					x: x,
					y: y
				});

				counter++;

				linksArr.push({ source: engine.localID, target: key });
			}
		});

		setNodes(nodesArr);
		setLinks(linksArr);
	};

	const updateResize = () => {
		setWidth(window.innerWidth - 50);
		setHeight(window.innerWidth / 2);
		updateNodes();
	};

	useEffect(() => {
		engine.playerDoc.observe(updateNodes);
		window.addEventListener('resize', updateResize);

		return () => {
			window.removeEventListener('resize', updateResize);
			engine.playerDoc.unobserve(updateNodes);
		};
	}, []);

	// apply filter, since somehow the links artifacts exits...
	// needed to be removed
	const ll = links.filter(({ source, target }) => {
		const found = nodes.find((node) => node.id === target);
		return found != null;
	});

	const data = {
		nodes,
		links: ll
	};

	const conf = {
		automaticRearrangeAfterDropNode: true,
		collapsible: false,
		directed: false,
		focusAnimationDuration: 1,
		focusZoom: 1,
		height: height,
		highlightDegree: 1,
		highlightOpacity: 0.2,
		linkHighlightBehavior: true,
		maxZoom: 8,
		minZoom: 0.1,
		nodeHighlightBehavior: true,
		panAndZoom: false,
		staticGraph: false,
		staticGraphWithDragAndDrop: false,
		width: width,
		d3: {
			alphaTarget: 0.05,
			gravity: -400,
			linkLength: 200,
			linkStrength: 2
		},
		node: {
			color: '#d3d3d3',
			fontColor: 'white',
			fontSize: 20,
			fontWeight: 'normal',
			highlightColor: 'red',
			highlightFontSize: 12,
			highlightFontWeight: 'bold',
			highlightStrokeColor: 'SAME',
			highlightStrokeWidth: 1.5,
			labelProperty: 'name',
			mouseCursor: 'pointer',
			opacity: 1,
			renderLabel: true,
			size: 450,
			strokeColor: 'none',
			strokeWidth: 1.5,
			svg: '',
			symbolType: 'circle'
		},
		link: {
			color: '#d3d3d3',
			fontColor: 'red',
			fontSize: 10,
			fontWeight: 'normal',
			highlightColor: 'blue',
			highlightFontSize: 8,
			highlightFontWeight: 'bold',
			mouseCursor: 'pointer',
			opacity: 1,
			renderLabel: false,
			semanticStrokeWidth: false,
			strokeWidth: 4,
			markerHeight: 6,
			markerWidth: 6
		}
	};

	// // graph event callbacks
	// const onClickGraph = function() {
	// 	window.alert(`Clicked the graph background`);
	// };

	// const onClickNode = function(nodeId) {
	// 	window.alert(`Clicked node ${nodeId}`);
	// };

	// const onDoubleClickNode = function(nodeId) {
	// 	window.alert(`Double clicked node ${nodeId}`);
	// };

	// const onRightClickNode = function(event, nodeId) {
	// 	window.alert(`Right clicked node ${nodeId}`);
	// };

	// const onMouseOverNode = function(nodeId) {
	// 	window.alert(`Mouse over node ${nodeId}`);
	// };

	// const onMouseOutNode = function(nodeId) {
	// 	window.alert(`Mouse out node ${nodeId}`);
	// };

	// const onClickLink = function(source, target) {
	// 	window.alert(`Clicked link between ${source} and ${target}`);
	// };

	// const onRightClickLink = function(event, source, target) {
	// 	window.alert(`Right clicked link between ${source} and ${target}`);
	// };

	// const onMouseOverLink = function(source, target) {
	// 	window.alert(`Mouse over in link between ${source} and ${target}`);
	// };

	// const onMouseOutLink = function(source, target) {
	// 	window.alert(`Mouse out link between ${source} and ${target}`);
	// };

	// const onNodePositionChange = function(nodeId, x, y) {
	// 	window.alert(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
	// };

	return (
		<div className="graph-view">
			<Graph
				id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
				data={data}
				config={conf}
				// onClickNode={onClickNode}
				// onRightClickNode={onRightClickNode}
				// onClickGraph={onClickGraph}
				// onClickLink={onClickLink}
				// onRightClickLink={onRightClickLink}
				// onMouseOverNode={onMouseOverNode}
				// onMouseOutNode={onMouseOutNode}
				// onMouseOverLink={onMouseOverLink}
				// onMouseOutLink={onMouseOutLink}
				// onNodePositionChange={onNodePositionChange}
			/>;
		</div>
	);

	// <div ref={el} />;
};

export default P2PGraph;
