import React from 'react';
import { DrawingPath } from '../../models';
import { DrawLine } from './drawing_line';

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
