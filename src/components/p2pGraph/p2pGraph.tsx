import React, { useEffect, useState, useCallback, useLayoutEffect, useRef } from 'react';
import { Graph } from './d3graph';
import { GraphNode, GraphLink, Player } from '../../models';
import './p2pGraph.css';

import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';
import { PlayerEngine } from '../../game_engine';

const avatars = new Avatars(sprites());
const map = new Map<string, string>();

const createAvatar = (name: string) => {
	if (map.has(name)) return map.get(name);

	const svgString = avatars.create(name);
	const blob = new Blob([ svgString ], { type: 'image/svg+xml' });
	const svgAvatar = URL.createObjectURL(blob);

	map.set(name, svgAvatar);
	return map.get(name);
};

interface P2PGraphProps {
	players: Array<Player>;
	localID: string;
	playerEngine: PlayerEngine;
}

interface GraphData {
	nodes: Array<GraphNode>;
	links: Array<GraphLink>;
}

interface WindowSize {
	height: number;
	width: number;
}

const GRAPH_HEIGHT = 400;

// TODO: link issues still exits..
// TODO: hen tap updates, no reconnect???

export const P2PGraph: React.FC<P2PGraphProps> = ({ localID, players, playerEngine }) => {
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

	const [ nodes, setNodes ] = useState<Array<GraphNode>>([ selfNode ]);

	const [ size, setSize ] = useState<WindowSize>({
		width: window.innerWidth,
		height: GRAPH_HEIGHT
	});

	const updateNodes = (players: Player[]) => {
		const linksArr = new Array<GraphLink>();

		const pArray = players.map((player: Player) => {
			const { name, id, points, x, y } = player;

			if (localID === player.id) {
				const newNode = {
					id: localID,
					color: '#e6194B',
					name: name + ' (You)',
					x: size.width * x,
					y: size.height * y,
					points,
					size: 800,
					svg: createAvatar(name)
				};
				return newNode;
			} else {
				const newNode = {
					id: id,
					name: name,
					color: '#911eb4',
					size: 600,
					x: size.width * x,
					y: size.height * y,
					points,
					svg: createAvatar(name)
				};

				linksArr.push({ source: localID, target: id });

				return newNode;
			}
		});

		// setNodes(pArray);
		setGraphData({
			nodes: pArray,
			links: linksArr
		});
	};

	// triggers, when players changed
	useEffect(
		() => {
			updateNodes(players);
		},
		[ players ]
	);

	const targetRef = useRef(null);
	const targetRefGraph = useRef(null);

	// triggers only when component is created
	useEffect(
		() => {
			const updateResize = () => {
				//@ts-ignore
				if (targetRef.current.offsetWidth < 900) {
					const size = {
						height: GRAPH_HEIGHT / 2,
						// @ts-ignore
						width: targetRef.current.offsetWidth
					};
					setSize(size);
					updateNodes(players);
				}
			};

			window.addEventListener('resize', updateResize);
			return () => {
				window.removeEventListener('resize', updateResize);
			};
		},
		[ players ]
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
		panAndZoom: false,
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

	const nodePosChange = (node) => {
		const { id, x, y } = node;
		const xx = x / size.width;
		const yy = y / size.height;
		playerEngine.changeLocalPosition(id, xx, yy);
	};

	// console.log(graphData.nodes[1]?.name,graphData.nodes[1]?.x)
	return (
		<div className="graph-view" ref={targetRef}>
			<Graph
				id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
				ref={targetRefGraph}
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
				onNodeDragMove={nodePosChange}
			/>;
		</div>
	);
};
