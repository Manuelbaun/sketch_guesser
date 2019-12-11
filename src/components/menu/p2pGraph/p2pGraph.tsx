import React, { useEffect, useState, useCallback } from 'react';
import { Graph } from 'react-d3-graph';

import { GraphNode, GraphLink, Player } from '../../../models';
import './p2pGraph.css';
import memoizeOne from 'memoize-one';

import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';
let avatars = new Avatars(sprites());

const map = new Map<string, string>();

const createAvatar = (name: string) => {
	if (map.has(name)) return map.get(name);
	console.log('create new avatar for ', name);
	let svgString = avatars.create(name);
	let blob = new Blob([ svgString ], { type: 'image/svg+xml' });
	const svgAvatar = URL.createObjectURL(blob);

	map.set(name, svgAvatar);
	return map.get(name);
};

interface P2PGraphProps {
	players: Array<Player>;
	localID: string;
}

interface GraphData {
	nodes: Array<GraphNode>;
	links: Array<GraphLink>;
}

interface WindowSize {
	height: number;
	width: number;
}

const GRAPH_HEIGHT: number = 400;

const P2PGraph: React.FC<P2PGraphProps> = ({ localID, players: p }) => {
	const selfNode = {
		id: localID,
		name: 'You',
		color: '#e6194B',
		x: window.innerWidth / 2,
		y: GRAPH_HEIGHT / 2,
		points: 0
	};

	const [ graphData, setGraphData ] = useState<GraphData>({
		nodes: [ selfNode ],
		links: []
	});

	const [ size, setSize ] = useState<WindowSize>({
		width: window.innerWidth - 50,
		height: GRAPH_HEIGHT / 2
	});

	const updateNodes = useCallback((players) => {
		const nodesArr: Array<GraphNode> = [];
		const linksArr: Array<GraphLink> = [];

		const arcSec = 2 * Math.PI / (players.length || 1);
		let counter = 1;

		console.log(players);
		players.forEach((player: Player) => {
			const { name, id, points } = player;
			const self = localID === player.id;

			if (self) {
				nodesArr.push({
					id: localID,
					color: '#e6194B',
					name: name + ' (You)',
					x: window.innerWidth / 2,
					y: GRAPH_HEIGHT / 2,
					points,
					svg: createAvatar(name)
				});
			} else {
				const x = size.width / 2 + Math.sin(arcSec * counter) * 100;
				const y = GRAPH_HEIGHT / 2 + Math.cos(arcSec * counter) * 100;

				nodesArr.push({
					id: id,
					name: name,
					color: '#911eb4',
					size: 450,
					x: x,
					y: y,
					points,
					svg: createAvatar(name)
				});

				linksArr.push({ source: localID, target: id });
				counter++;
			}
		});

		setGraphData({
			nodes: nodesArr,
			links: linksArr
		});
	}, []);

	// triggers, when players changed
	useEffect(
		() => {
			// console.log('UseEffect PLAYER changed has been called');
			updateNodes(p);
		},
		[ p ]
	);

	// triggers only when component is created
	useEffect(
		() => {
			const updateResize = () => {
				if (window.innerWidth < 900) {
					setSize({
						height: GRAPH_HEIGHT / 2,
						width: window.innerWidth - 50
					});
					updateNodes(p);
				}
			};

			window.addEventListener('resize', updateResize);

			return () => {
				window.removeEventListener('resize', updateResize);
			};
		},
		[ p ]
	);

	const conf = {
		height: GRAPH_HEIGHT,
		width: size.width,
		automaticRearrangeAfterDropNode: true,
		collapsible: false,
		directed: false,
		focusAnimationDuration: 1,
		focusZoom: 1,
		highlightDegree: 1,
		highlightOpacity: 0.2,
		linkHighlightBehavior: true,
		maxZoom: 8,
		minZoom: 0.1,
		nodeHighlightBehavior: true,
		panAndZoom: true,
		staticGraph: false,
		staticGraphWithDragAndDrop: false,
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
			highlightFontSize: 25,
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
			// highlightColor: 'blue',
			highlightFontSize: 8,
			// highlightFontWeight: 'bold',
			mouseCursor: 'pointer',
			opacity: 1,
			renderLabel: false,
			semanticStrokeWidth: false,
			strokeWidth: 4,
			markerHeight: 6,
			markerWidth: 6
		}
	};

	return (
		<div className="graph-view">
			<Graph
				id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
				data={graphData}
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
};

export default P2PGraph;
