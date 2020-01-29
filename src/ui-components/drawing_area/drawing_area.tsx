import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import { Subscription } from 'rxjs';
import './drawing_area.css';
import { DrawingService, DrawingPath, Coordinate } from '../../components/drawing';

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

type Props = {
	width: number;
	height: number;
	service: DrawingService;
};

type State = {
	isPainting: boolean;
	color: string;
};

export class DrawingArea extends React.Component<Props, State> {
	private canvasRef = React.createRef<HTMLCanvasElement>();
	private service: DrawingService;
	private drawingSub: Subscription;

	constructor(props: Props) {
		super(props);
		this.service = props.service;

		this.state = {
			isPainting: false,
			color: colorPalette[0]
		};

		let currentPaths = 0;
		this.drawingSub = this.service.subject.subscribe((paths) => {
			// Clear the canvas
			if (paths.length === 0) {
				this.clearCanvas();
				currentPaths = 0;
			} else if (paths.length !== currentPaths) {
				// check how many paths already drawn
				for (let i = currentPaths; i < paths.length; i++) {
					this.drawPath(paths[i]);
				}
				currentPaths = paths.length;
			} else {
				// redraw the last path.
				// TODO Optimize this one
				const p = paths[paths.length - 1];
				this.drawPath(p);
			}
		});
	}

	componentDidMount() {
		if (!this.canvasRef.current) return;

		const canvas = this.canvasRef.current;
		canvas.addEventListener('mousemove', this.paint);
		canvas.addEventListener('touchmove', this.paintTouch);

		canvas.addEventListener('mousedown', this.startPaint);
		canvas.addEventListener('touchstart', this.startPaintTouch);

		canvas.addEventListener('mouseup', this.exitPaint);
		canvas.addEventListener('mouseleave', this.exitPaint);
		canvas.addEventListener('touchcancel', this.exitPaint);
		canvas.addEventListener('touchend', this.exitPaint);
	}

	componentWillUnmount() {
		// remove subscription from the drawing manager!

		this.drawingSub.unsubscribe();
		if (!this.canvasRef.current) return;

		const canvas = this.canvasRef.current;
		canvas.removeEventListener('mousemove', this.paint);
		canvas.removeEventListener('touchmove', this.paintTouch);
		canvas.removeEventListener('mousedown', this.startPaint);
		canvas.removeEventListener('touchstart', this.startPaintTouch);

		canvas.removeEventListener('mouseup', this.exitPaint);
		canvas.removeEventListener('mouseleave', this.exitPaint);
		canvas.removeEventListener('touchcancel', this.exitPaint);
		canvas.removeEventListener('touchend', this.exitPaint);
	}

	drawPath = ({ color, origin, line }: DrawingPath) => {
		if (!this.canvasRef.current) return;
		const canvas: HTMLCanvasElement = this.canvasRef.current;
		const ctx = canvas.getContext('2d');

		if (ctx != null) {
			ctx.strokeStyle = color;
			ctx.shadowColor = color;
			ctx.lineJoin = 'round';
			ctx.lineWidth = 5;

			ctx.beginPath();
			ctx.moveTo(origin.x * canvas.width, origin.y * canvas.height);

			line.forEach(({ x, y }: Coordinate) => {
				ctx.lineTo(x * canvas.width, y * canvas.height);
			});

			ctx.stroke();
			ctx.closePath();
		}
	};

	// Returns the PointerCoordinates relatively to the canvas
	calculateCoordinates = (x: number, y: number): Coordinate | undefined => {
		if (!this.canvasRef.current) return;

		const canvasRect = this.canvasRef.current.getBoundingClientRect();

		return {
			x: x / canvasRect.width,
			y: y / canvasRect.height
		};
	};

	calculateTouchCoordinates = (x: number, y: number): Coordinate | undefined => {
		if (!this.canvasRef.current) return;

		const canvasRect = this.canvasRef.current.getBoundingClientRect();

		const cor = {
			x: (x - canvasRect.left) / canvasRect.width,
			y: (y - canvasRect.top) / canvasRect.height
		};

		return cor;
	};

	startPaint = (event) => {
		const { offsetX: x, offsetY: y } = event;
		const { color } = this.state;
		const origin = this.calculateCoordinates(x, y);

		if (origin) {
			this.setState({ isPainting: true });
			this.service.addNewPath(origin, color);
		}
	};

	startPaintTouch = (event) => {
		event.preventDefault();
		event.stopPropagation();
		const { clientX: x, clientY: y } = event.touches[0];
		const { color } = this.state;
		const origin = this.calculateTouchCoordinates(x, y);
		if (origin) {
			this.setState({ isPainting: true });
			this.service.addNewPath(origin, color);
		}
	};

	paintTouch = (event) => {
		event.preventDefault();
		event.stopPropagation();
		const { isPainting } = this.state;
		const { clientX: x, clientY: y } = event.touches[0];

		if (isPainting) {
			const newCoordinates = this.calculateTouchCoordinates(x, y);
			if (newCoordinates) {
				this.service.appendCoordinates(newCoordinates);
			}
		}
	};

	paint = (event) => {
		const { offsetX: x, offsetY: y } = event;
		const { isPainting } = this.state;
		if (isPainting) {
			const newCoordinates = this.calculateCoordinates(x, y);

			if (newCoordinates) {
				this.service.appendCoordinates(newCoordinates);
			}
		}
	};

	exitPaint = () => this.setState({ isPainting: false });

	clearCanvas = () => {
		if (!this.canvasRef.current) return;

		const ctx = this.canvasRef.current.getContext('2d');

		if (ctx) {
			this.service.clearDrawing();
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
	};

	render() {
		const { height, width } = this.props;

		return (
			<div className="drawing-container">
				<canvas ref={this.canvasRef} height={height} width={width} />
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
								onClick={(): void => this.setState({ color })}
							/>
						))}
						<div
							style={{
								paddingLeft: '2em'
							}}
						>
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
								onClick={() => this.clearCanvas()}
							>
								X
							</Button>
						</div>
					</ButtonToolbar>
				</div>
			</div>
		);
	}
}
