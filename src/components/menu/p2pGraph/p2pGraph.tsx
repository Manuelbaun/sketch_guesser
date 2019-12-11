import React, { useEffect, useState, useCallback } from 'react';
import { Graph } from 'react-d3-graph';

import { GraphNode, GraphLink, Player } from '../../../models';
import './p2pGraph.css';

import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';
let avatars = new Avatars(sprites());

interface P2PGraphProps {
	players: Array<Player>;
	localID: string;
}

const P2PGraph: React.FC<P2PGraphProps> = ({ localID, players }) => {
	const selfNode = {
		id: localID,
		name: 'You',
		color: '#e6194B',
		x: window.innerWidth / 2,
		y: window.innerWidth / 4,
		points: 0
	};

	const [ nodes, setNodes ] = useState<Array<GraphNode>>([ selfNode ]);
	const [ links, setLinks ] = useState<Array<GraphLink>>([]);

	const [ width, setWidth ] = useState(window.innerWidth - 50);
	const [ height, setHeight ] = useState(window.innerWidth / 2);

	const updateNodes = useCallback(
		() => {
			const nodesArr: Array<GraphNode> = [];
			const linksArr: Array<GraphLink> = [];

			const arcSec = 2 * Math.PI / (players.length || 1);
			let counter = 1;
			players.forEach((player: Player) => {
				const { name: _name, id, points } = player;
				const self = localID === player.id;

				const name = id === localID ? _name + ' (You)' : _name;

				let svgString = avatars.create(_name);
				let blob = new Blob([ svgString ], { type: 'image/svg+xml' });
				let svg = URL.createObjectURL(blob);

				if (self) {
					nodesArr.push({
						id: localID,
						color: '#e6194B',
						name: name,
						x: window.innerWidth / 2,
						y: window.innerWidth / 4,
						points,
						svg
					});
				} else {
					const x = width / 2 + Math.sin(arcSec * counter) * 100;
					const y = height / 2 + Math.cos(arcSec * counter) * 100;

					nodesArr.push({
						id: id,
						name: name,
						color: '#911eb4',
						size: 450,
						x: x,
						y: y,
						points,
						svg
					});

					counter++;

					linksArr.push({ source: localID, target: id });
				}
			});

			setNodes(nodesArr);
			setLinks(linksArr);
		},
		[ players ]
	);

	// triggers only when component is created
	useEffect(() => {
		const updateResize = () => {
			setWidth(window.innerWidth - 50);
			setHeight(window.innerWidth / 2);
			updateNodes();
		};
		window.addEventListener('resize', updateResize);

		return () => {
			window.removeEventListener('resize', updateResize);
		};
	}, []);

	// triggers, when players changed
	useEffect(
		() => {
			console.log('UseEffect has been called');
			updateNodes();
		},
		[ players ]
	);

	const conf = {
		height: height,
		width: width,
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

	if (nodes.length === 0) return <div className="graph-view" />;

	return (
		<div className="graph-view">
			<Graph
				id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
				data={{
					nodes,
					links
				}}
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
