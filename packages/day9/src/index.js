import { readFile } from 'node:fs/promises';

export const range = (start, length) => Array.from(new Array(length), (_, i) => start + i);

const inTailRage = ({ x, y }, { x: tx, y: ty }) => {
	return x <= tx + 1 && x >= tx - 1 && y <= ty + 1 && y >= ty - 1;
};

const moveTail = ({ x: hX, y: hY }, tPosition, i) => {
	let { x: tX, y: tY } = tPosition[i];

	let refX = 0;
	let refY = 0;

	if (i > 0) {
		let { x: prevtX, y: prevtY } = tPosition[i - 1];
		refX = prevtX;
		refY = prevtY;
	} else {
		refX = hX;
		refY = hY;
	}

	let diffX = Math.abs(refX - tX);
	let diffY = Math.abs(refY - tY);

	if (diffX < 2 && diffY < 2) {
		return;
	}

	if (diffX > 1 && diffY === 0) {
		if (refX - tX > 0) {
			tX++;
		} else {
			tX--;
		}
	} else if (diffY > 1 && diffX === 0) {
		if (refY - tY > 0) {
			tY++;
		} else {
			tY--;
		}
	} else {
		if (refX - tX > 0) {
			tX++;
		} else {
			tX--;
		}

		if (refY - tY > 0) {
			tY++;
		} else {
			tY--;
		}
	}

	tPosition[i].x = tX;
	tPosition[i].y = tY;
	tPosition[i].move++;
};

const move = (direction, rPosition, tPosition) => {
	switch (direction) {
		case 'R':
			rPosition.x++;
			break;
		case 'L':
			rPosition.x--;
			break;
		case 'D':
			rPosition.y--;
			break;
		case 'U':
			rPosition.y++;
			break;
		default:
			break;
	}

	rPosition.move++;

	const mapSize = 25;

	const map = range(0, mapSize * 2).map(() => range(0, mapSize * 2).map(() => '.'));

	for (let i = 0; i < tPosition.length; i++) {
		moveTail(rPosition, tPosition, i);
	}

	// map[rPosition.y + mapSize][rPosition.x + mapSize] = 'H';

	// for (let i = 0; i < tPosition.length; i++) {
	// 	const { x, y } = tPosition[i];

	// 	if (map[y + mapSize][x + mapSize] === '.') {
	// 		map[y + mapSize][x + mapSize] = i + 1;
	// 	}
	// }

	return map;
};

try {
	const filePath = new URL('./data', import.meta.url);
	const data = await readFile(filePath, { encoding: 'utf8' });

	const contents = data.split('\n').filter(content => content !== '');

	let positionMap = {
		'0-0': true,
	};
	let positionCalculate = 1;

	let rPosition = {
		x: 0,
		y: 0,
		move: 0,
	};

	let tPosition = {
		x: 0,
		y: 0,
		move: 0,
	};

	contents.forEach(content => {
		const [direction, step] = content.split(' ');

		for (let i = 1; i <= step; i++) {
			const oldrPosition = { ...rPosition };

			switch (direction) {
				case 'R':
					rPosition.x++;
					break;
				case 'L':
					rPosition.x--;
					break;
				case 'D':
					rPosition.y--;
					break;
				case 'U':
					rPosition.y++;
					break;
				default:
					break;
			}

			rPosition.move++;

			if (!inTailRage(rPosition, tPosition)) {
				tPosition.x = oldrPosition.x;
				tPosition.y = oldrPosition.y;
				tPosition.move++;

				if (typeof positionMap[`${tPosition.x}-${tPosition.y}`] === 'undefined') {
					positionMap[`${tPosition.x}-${tPosition.y}`] = true;
					positionCalculate++;
				}
			}
		}
	});

	console.log('Result', positionCalculate);
	// console.log('Map', map);

	positionMap = {};
	positionCalculate = 0;

	const NineMap = range(0, 500).map(() => range(0, 500).map(() => '.'));

	rPosition = {
		x: 0,
		y: 0,
		move: 0,
	};

	tPosition = [
		{ x: 0, y: 0, move: 0 },
		{ x: 0, y: 0, move: 0 },
		{ x: 0, y: 0, move: 0 },
		{ x: 0, y: 0, move: 0 },
		{ x: 0, y: 0, move: 0 },
		{ x: 0, y: 0, move: 0 },
		{ x: 0, y: 0, move: 0 },
		{ x: 0, y: 0, move: 0 },
		{ x: 0, y: 0, move: 0 },
	];

	contents.forEach(content => {
		const [direction, step] = content.split(' ');

		// console.log('command', content);

		for (let i = 1; i <= step; i++) {
			const snapshotMap = move(direction, rPosition, tPosition);

			const { x, y } = tPosition[8];

			if (typeof positionMap[`${x}-${y}`] === 'undefined') {
				positionMap[`${x}-${y}`] = true;
				positionCalculate++;
				NineMap[y + 250][x + 350] = '#';
			}

			// console.log(snapshotMap.map(row => row.join('')).join('\n'));
		}
	});

	// console.log(scoreMap);

	console.log('Part 2 result', positionCalculate);
	console.log(JSON.stringify(tPosition, null, '  '));
	// console.log(NineMap.map(row => row.join('')).join('\n'));
} catch (err) {
	console.error(err);
}
