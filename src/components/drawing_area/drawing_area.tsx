import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { DrawingManager } from './draw_manager';
import { Coordinate, DrawingPath } from '../../models';
import './drawing_area.css';

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
// define some sizes, when acting as presenter or as guesser
interface DrawingAreaProps {
	width: number;
	height: number;
	drawingManager: DrawingManager;
}

export const DrawingArea: React.FC<DrawingAreaProps> = (props: DrawingAreaProps) => {
	const { width, height, drawingManager } = props;
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [ isPainting, setIsPainting ] = useState(false);
	const [ color, setColor ] = useState(colorPalette[0]);

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
	const drawPath = ({ color, origin, line }: DrawingPath): void => {
		if (!canvasRef.current) return;
		const canvas: HTMLCanvasElement = canvasRef.current;
		const context = canvas.getContext('2d');

		if (context != null) {
			context.strokeStyle = color;
			context.shadowColor = color;
			context.lineJoin = 'round';
			context.lineWidth = 5;

			context.beginPath();
			context.moveTo(origin.x * canvas.width, origin.y * canvas.height);

			line.forEach(({ x, y }: Coordinate) => {
				context.lineTo(x * canvas.width, y * canvas.height);
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
			x: x / canvasRect.width,
			y: y / canvasRect.height
		};
	};

	const calculateTouchCoordinates = (x: number, y: number): Coordinate | undefined => {
		if (!canvasRef.current) return;

		const canvas: HTMLCanvasElement = canvasRef.current;
		const canvasRect = canvas.getBoundingClientRect();
		const cor = {
			x: (x - canvasRect.left) / canvasRect.width,
			y: (y - canvasRect.top) / canvasRect.height
		};

		return cor;
	};

	const startPaint = useCallback(
		(event) => {
			const { offsetX: x, offsetY: y } = event;
			const origin = calculateCoordinates(x, y);
			if (origin) {
				setIsPainting(true);
				drawingManager.addNewPath(origin, color);
			}
		},
		[ color ]
	);

	const startPaintTouch = useCallback(
		(event) => {
			event.preventDefault();
			event.stopPropagation();
			// const { clientX, clientY } = event.touches[0];
			const { clientX: x, clientY: y } = event.touches[0];
			// console.log(event.touches[0], event.touches[0]);
			const origin = calculateTouchCoordinates(x, y);
			// console.log(origin);
			if (origin) {
				setIsPainting(true);
				drawingManager.addNewPath(origin, color);
			}
		},
		[ color ]
	);

	const paintTouch = useCallback(
		(event) => {
			event.preventDefault();
			event.stopPropagation();
			// const { clientX, clientY } = event.touches[0];
			const { clientX: x, clientY: y } = event.touches[0];
			// console.log(x, y, event.touches[0]);

			if (isPainting) {
				const newCoordinates = calculateTouchCoordinates(x, y);
				if (newCoordinates) {
					drawingManager.appendCoordinates(newCoordinates);
				}
			}
		},
		[ isPainting ]
	);

	const paint = useCallback(
		(event) => {
			const { offsetX: x, offsetY: y } = event;
			if (isPainting) {
				const newCoordinates = calculateCoordinates(x, y);

				if (newCoordinates) {
					drawingManager.appendCoordinates(newCoordinates);
				}
			}
		},
		[ isPainting ]
	);

	const exitPaint = useCallback(() => {
		setIsPainting(false);
	}, []);

	const clearCanvas = () => {
		if (!canvasRef.current) return;

		const canvas: HTMLCanvasElement = canvasRef.current;
		const context = canvas.getContext('2d');

		if (context) {
			drawingManager.clearPaths();
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		}
	};

	// setup useEffect
	useEffect(() => {
		let currentPaths: number = 0;
		drawingManager.subscribe((paths) => {
			// Clear the canvas
			if (paths.length === 0) {
				clearCanvas();
				currentPaths = 0;
			} else if (paths.length != currentPaths) {
				// check how many paths already drawn
				for (let i = currentPaths; i < paths.length; i++) {
					drawPath(paths[i]);
				}
				currentPaths = paths.length;
			} else {
				// redraw the last path.
				// TODO Optimize this one
				const p = paths[paths.length - 1];
				drawPath(p);
			}
		});
	}, []);

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
							onClick={(): void => setColor(color)}
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
					onClick={clearCanvas}
				>
					X
				</Button>
			</div>
		</div>
	);
};
