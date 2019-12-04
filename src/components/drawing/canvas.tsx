import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import './canvas.css';

interface CanvasProps {
	width: number;
	height: number;
}

// Relative position between 0..1
type Coordinate = {
	x: number;
	y: number;
};

const Canvas = ({ width, height }: CanvasProps) => {
	const colors = [
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

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ isPainting, setIsPainting ] = useState(false);
	const [ color, setColor ] = useState('red');
	const [ pointerPosition, setPointerPosition ] = useState<Coordinate | undefined>(undefined);

	// Setup callback function
	const startPaint = useCallback(({ clientX, clientY }) => {
		const coordinates = calculateCoordinates(clientX, clientY);
		if (coordinates) {
			setPointerPosition(coordinates);
			setIsPainting(true);
		}
	}, []);

	const startPaintTouch = useCallback((event) => {
		if (event.touches.length === 1) {
			const { clientX, clientY } = event.touches[0];
			const coordinates = calculateCoordinates(clientX, clientY);
			if (coordinates) {
				setPointerPosition(coordinates);
				setIsPainting(true);
			}
		}
	}, []);

	const paintTouch = useCallback(
		(event) => {
			const { clientX, clientY } = event.touches[0];
			if (isPainting) {
				const newMousePosition = calculateCoordinates(clientX, clientY);
				if (pointerPosition && newMousePosition) {
					drawLine(pointerPosition, newMousePosition);
					setPointerPosition(newMousePosition);
				}
			}
		},
		[ isPainting, pointerPosition ]
	);

	const paint = useCallback(
		({ clientX, clientY }) => {
			if (isPainting) {
				const newMousePosition = calculateCoordinates(clientX, clientY);
				if (pointerPosition && newMousePosition) {
					drawLine(pointerPosition, newMousePosition);
					setPointerPosition(newMousePosition);
				}
			}
		},
		[ isPainting, pointerPosition ]
	);

	const exitPaint = useCallback(() => {
		setIsPainting(false);
		setPointerPosition(undefined);
	}, []);

	const clearCanvas = useCallback(() => {
		if (!canvasRef.current) return;

		const canvas: HTMLCanvasElement = canvasRef.current;
		const context = canvas.getContext('2d');
		if (context) {
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
		[ startPaint, startPaintTouch ]
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

	const drawLine = (startPos: Coordinate, endPos: Coordinate) => {
		if (!canvasRef.current) return;

		const canvas: HTMLCanvasElement = canvasRef.current;
		const context = canvas.getContext('2d');
		if (context) {
			context.strokeStyle = color;
			context.lineJoin = 'round';
			context.lineWidth = 5;
			const xStart = startPos.x * canvas.width;
			const yStart = startPos.y * canvas.height;
			const xEnd = endPos.x * canvas.width;
			const yEnd = endPos.y * canvas.height;

			context.beginPath();
			context.moveTo(xStart, yStart);
			context.lineTo(xEnd, yEnd);
			context.closePath();
			context.stroke();
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
					{colors.map((color) => (
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
					onClick={() => clearCanvas()}
				>
					{' '}
					X
				</Button>
			</div>
		</div>
	);
};

Canvas.defaultProps = {
	width: 2000,
	height: 1000
};

export default Canvas;
