import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import DrawEngine, { Coordinate } from './draw.engine';

import './canvas.css';

const colorPalette = [
	'#e6194B',
	'#f58231',
	'#ffe119',
	'#bfef45',
	'#3cb44b',
	'#42d4f4',
	'#4363d8',
	'#911eb4',
	'#f032e6',
	'#a9a9a9',
	'#000000',
	'#ffffff'
];

// TODO: Remove all listener, when user is not the current presenter

export interface ICanvasProps {
	width?: number;
	height?: number;
	drawingEngine: DrawEngine;
}

const DrawingArea: React.FC<ICanvasProps> = ({ width, height, drawingEngine }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [ isPainting, setIsPainting ] = useState(false);
	const [ color, setColor ] = useState(colorPalette[0]);

	const startPaint = useCallback(
		({ clientX, clientY }) => {
			const origin = calculateCoordinates(clientX, clientY);
			if (origin) {
				setIsPainting(true);
				drawingEngine.addNewPath(origin, color);
			}
		},
		[ color ]
	);

	const startPaintTouch = useCallback(
		(event) => {
			const { clientX, clientY } = event.touches[0];
			const origin = calculateCoordinates(clientX, clientY);
			if (origin) {
				setIsPainting(true);
				drawingEngine.addNewPath(origin, color);
			}
		},
		[ color ]
	);

	const paintTouch = useCallback(
		(event) => {
			const { clientX, clientY } = event.touches[0];
			if (isPainting) {
				const newCoordinates = calculateCoordinates(clientX, clientY);
				if (newCoordinates) {
					drawingEngine.appendCoordinates(newCoordinates);
				}
			}
		},
		[ isPainting ]
	);

	const paint = useCallback(
		({ clientX, clientY }) => {
			if (isPainting) {
				const newCoordinates = calculateCoordinates(clientX, clientY);
				if (newCoordinates) {
					drawingEngine.appendCoordinates(newCoordinates);
				}
			}
		},
		[ isPainting ]
	);

	const exitPaint = useCallback(() => {
		setIsPainting(false);
	}, []);

	const clearCanvas = useCallback(() => {
		if (!canvasRef.current) return;

		const canvas: HTMLCanvasElement = canvasRef.current;
		const context = canvas.getContext('2d');
		if (context) {
			drawingEngine.clearPaths();
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		}
	}, []);

	// setup useEffect

	useEffect(
		() => {
			if (!canvasRef.current) return;

			const canvas: HTMLCanvasElement = canvasRef.current;
			canvas.addEventListener('mousedown', startPaint);
			canvas.addEventListener('touchstart', startPaintTouch);

			return () => {
				canvas.removeEventListener('mousedown', startPaint);
				canvas.removeEventListener('touchstart', startPaintTouch);
			};
		},
		[ startPaint ]
	);

	useEffect(
		() => {
			if (!canvasRef.current) return;

			const canvas: HTMLCanvasElement = canvasRef.current;
			canvas.addEventListener('mousemove', paint);
			canvas.addEventListener('touchmove', paintTouch);
			return () => {
				canvas.removeEventListener('mousemove', paint);
				canvas.removeEventListener('touchmove', paintTouch);
			};
		},
		[ paint, paintTouch ]
	);

	useEffect(
		() => {
			if (!canvasRef.current) return;

			const canvas: HTMLCanvasElement = canvasRef.current;
			canvas.addEventListener('mouseup', exitPaint);
			canvas.addEventListener('mouseleave', exitPaint);
			canvas.addEventListener('touchcancel', exitPaint);
			canvas.addEventListener('touchend', exitPaint);

			return () => {
				canvas.removeEventListener('mouseup', exitPaint);
				canvas.removeEventListener('mouseleave', exitPaint);
				canvas.removeEventListener('touchcancel', exitPaint);
				canvas.removeEventListener('touchend', exitPaint);
			};
		},
		[ exitPaint ]
	);

	// Draw Canvas!
	drawingEngine.subscribe((paths) => {
		if (paths.length === 0) clearCanvas();

		// const lastPath = paths[paths.length - 1];
		// if (lastPath) drawPath(lastPath);

		paths.forEach((path) => {
			drawPath(path);
		});
	});

	/**
	 * Needs to be an Y.Map! with structure DrawingPath
	 * @param drawElement 
	 * 
	 * @example
	 * {
	 * 	color: string
	 *	origin: Coordinate
	 *	path : Array<Coordinate>
	 * }
	 */

	// TODO: Should only draw the last point
	// and not the whole draw line... => needs refactor with drawingEngine
	const drawPath = (drawElement) => {
		if (!canvasRef.current) return;
		const canvas: HTMLCanvasElement = canvasRef.current;
		const context = canvas.getContext('2d');

		if (context != null) {
			const color = drawElement.get('color');
			const origin = drawElement.get('origin');
			const path = drawElement.get('path');

			context.strokeStyle = color;
			context.shadowColor = color;
			context.lineJoin = 'round';
			context.lineWidth = 5;
			const xStart = origin.x * canvas.width;
			const yStart = origin.y * canvas.height;

			context.beginPath();
			context.moveTo(xStart, yStart);
			// console.log(path.toArray());
			path.forEach((c: Coordinate) => {
				const x = c.x * canvas.width;
				const y = c.y * canvas.height;
				context.lineTo(x, y);
			});

			context.stroke();
			context.closePath();
		}
	};

	// Returns the PointerCoordinates relatively to the canvas
	const calculateCoordinates = (x: number, y: number): Coordinate | undefined => {
		if (!canvasRef.current) return;

		const canvas: HTMLCanvasElement = canvasRef.current;
		const canvasRect = canvas.getBoundingClientRect();

		return {
			x: (x - canvas.offsetLeft) / canvasRect.width,
			y: (y - canvas.offsetTop) / canvasRect.height
		};
	};

	return (
		<div className="drawing-container">
			<canvas ref={canvasRef} height={height} width={width} />
			<div className="toolbar">
				<ButtonToolbar>
					{colorPalette.map((color) => (
						<Button
							key={color}
							variant="dark"
							className="rounded-circle"
							style={{
								backgroundColor: color,
								height: 40,
								width: 40,
								margin: '0.2em'
							}}
							onClick={() => setColor(color)}
						/>
					))}
				</ButtonToolbar>
				<Button
					className="rounded-circle"
					style={{
						backgroundColor: '#ffffff',
						borderColor: '#ffffff',
						color: 'black',
						height: 50,
						width: 50,
						margin: '0.2em'
					}}
					onClick={() => drawingEngine.clearPaths()}
				>
					X
				</Button>
			</div>
		</div>
	);
};

DrawingArea.defaultProps = {
	width: 2000,
	height: 1000
};

export default DrawingArea;