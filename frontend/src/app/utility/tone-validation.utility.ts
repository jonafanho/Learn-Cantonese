export interface ToneThreshold {
	tone: number;
	label: string;
	validate: (xStart: number, yStart: number, xEnd: number, yEnd: number) => boolean;
}

function safeSlope(xStart: number, yStart: number, xEnd: number, yEnd: number): number {
	const dx = xEnd - xStart;

	if (dx === 0) {
		return yEnd > yStart ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
	}

	return (yEnd - yStart) / dx;
}

export const TONE_THRESHOLDS: ToneThreshold[] = [
	{
		tone: 1,
		label: "High Flat",
		validate: (_xs, ys, _xe, ye) => ys < 30 && ye < 30 && Math.abs(safeSlope(_xs, ys, _xe, ye)) <= 0.2,
	},
	{
		tone: 2,
		label: "High Rising",
		validate: (_xs, ys, _xe, ye) => ys > 40 && ye < 25 && safeSlope(_xs, ys, _xe, ye) <= -0.5,
	},
	{
		tone: 3,
		label: "Mid Flat",
		validate: (_xs, ys, _xe, ye) => ys > 35 && ys < 65 && ye > 35 && ye < 65 && Math.abs(safeSlope(_xs, ys, _xe, ye)) <= 0.2,
	},
	{
		tone: 4,
		label: "Low Falling",
		validate: (_xs, ys, _xe, ye) => ys < 60 && ye > 75 && safeSlope(_xs, ys, _xe, ye) >= 0.5,
	},
	{
		tone: 5,
		label: "Low Rising",
		validate: (_xs, ys, _xe, ye) => ys > 75 && ye > 45 && ye < 65 && safeSlope(_xs, ys, _xe, ye) <= -0.4,
	},
	{
		tone: 6,
		label: "Low Flat",
		validate: (_xs, ys, _xe, ye) => ys > 70 && ye > 70 && Math.abs(safeSlope(_xs, ys, _xe, ye)) <= 0.2,
	},
];

export function normalizeCoordinate(raw: number, max: number): number {
	return Math.max(0, Math.min(100, (raw / max) * 100));
}

export function isStrokeLongEnough(
	xStart: number, yStart: number, xEnd: number, yEnd: number, minDistance = 10,
): boolean {
	const dx = xEnd - xStart;
	const dy = yEnd - yStart;

	return Math.sqrt(dx * dx + dy * dy) >= minDistance;
}

export function validateTone(
	xStart: number, yStart: number, xEnd: number, yEnd: number,
	targetTone: number,
	thresholds: ToneThreshold[] = TONE_THRESHOLDS,
): boolean {
	const threshold = thresholds.find(t => t.tone === targetTone);

	if (!threshold) {
		return false;
	}

	return threshold.validate(xStart, yStart, xEnd, yEnd);
}
