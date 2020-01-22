import React, { useEffect, useState } from 'react';
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';

const avatars = new Avatars(sprites());
const caching = new Map<string, string>();

const createAvatar = (name: string) => {
	if (caching.has(name)) return caching.get(name);

	const svgString = avatars.create(name);
	const blob = new Blob([ svgString ], { type: 'image/svg+xml' });
	const svgAvatar = URL.createObjectURL(blob);

	caching.set(name, svgAvatar);
	return caching.get(name);
};

type Props = {
	name: string;
};

export const Avatar: React.FC<Props> = ({ name }) => {
	return <img src={createAvatar(name)} height="100" width="100" />;
};
