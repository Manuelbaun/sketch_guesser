import React from 'react';
import { DrawingPath } from '../../components/drawing';

type Props = {
	path: DrawingPath;
	width: number;
	height: number;
};

// Function component without React.FC
export const DrawLine = (props: Props) => {
	const { width, height, path } = props;

	const pathData =
		'M ' +
		path.line
			.map((p) => {
				return `${p.x * width} ${p.y * height}`;
			})
			.join(' L ');

	return (
		<path
			className="path"
			stroke={props.path.color}
			fill={'none'}
			strokeWidth={'2px'}
			strokeLinejoin={'round'}
			strokeLinecap={'round'}
			d={pathData}
		/>
	);
};
