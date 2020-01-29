function addZero(t: number | string): string {
	if (t < 10) t = '0' + t;
	return t.toString();
}

export function convertDateToString(date: Date): string {
	let h = date.getHours();
	const m = addZero(date.getMinutes());
	const s = addZero(date.getSeconds());

	if (h > 12) h -= 12;
	else if (h === 0) h = 12;

	return `${h}:${m}:${s}`;
}
