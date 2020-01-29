import React from 'react';

import { DrawLine } from './draw_line';
import { DrawingPath } from '../../components/drawing';

type Props = {
	paths: Array<DrawingPath>;
	width: number;
	height: number;
};

export const DrawArea = (props: Props) => {
	const { paths, width, height } = props;
	const svgPaths = paths.map((path, index) => <DrawLine key={index} path={path} width={width} height={height} />);

	return <svg className="drawing">{svgPaths}</svg>;
};
