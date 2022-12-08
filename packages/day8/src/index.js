import { readFile } from 'node:fs/promises';

export const range = (start, length) => Array.from(new Array(length), (_, i) => start + i);

const visibleCalculate = (map, scoreMap, currentPosition) => {
	const { x, y } = currentPosition;
	const currentHeight = map[y][x];
	const scoreResult = {
		score: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	};

	// left
	for (let i = x - 1; i >= 0; i--) {
		if (map[y][i] >= currentHeight) {
			scoreResult.left++;
			break;
		}

		if (scoreMap[y][i].left > 0) {
			scoreResult.left += scoreMap[y][i].left;

			i -= scoreMap[y][i].left - 1;
		} else {
			scoreResult.left++;
		}
	}

	// right
	for (let i = x + 1; i < map[y].length; i++) {
		if (map[y][i] >= currentHeight) {
			scoreResult.right++;
			break;
		}

		if (scoreMap[y][i].right > 0) {
			scoreResult.right += scoreMap[y][i].right;

			i += scoreMap[y][i].right - 1;
		} else {
			scoreResult.right++;
		}
	}

	// top
	for (let i = y - 1; i >= 0; i--) {
		if (map[i][x] >= currentHeight) {
			scoreResult.top++;
			break;
		}

		if (scoreMap[i][x].top > 0) {
			scoreResult.top += scoreMap[i][x].top;

			i -= scoreMap[i][x].top - 1;
		} else {
			scoreResult.top++;
		}
	}

	// bottom
	for (let i = y + 1; i < map.length; i++) {
		if (map[i][x] >= currentHeight) {
			scoreResult.bottom++;
			break;
		}

		if (scoreMap[i][x].bottom > 0) {
			scoreResult.bottom += scoreMap[i][x].bottom;

			i += scoreMap[i][x].bottom - 1;
		} else {
			scoreResult.bottom++;
		}

		// console.log(`x ${x} y ${i}, ${map[i][x]}`);
	}

	scoreResult.score = scoreResult.left * scoreResult.right * scoreResult.top * scoreResult.bottom;

	return scoreResult;
};

try {
	const filePath = new URL('./data', import.meta.url);
	const data = await readFile(filePath, { encoding: 'utf8' });

	const contents = data.split('\n').filter(content => content !== '');

	const row = contents.length;
	const column = contents[0].length;

	const visibleMap = range(0, row).map(() => range(0, column).map(() => 0));
	const map = range(0, row).map(() => range(0, column).map(() => 0));
	const scoreMap = range(0, row).map(() =>
		range(0, column).map(() => ({
			score: 0,
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
		})),
	);

	const topVisibleBase = range(0, column).map(() => 0);
	const rightVisibleBase = range(0, row).map(() => 0);

	const bottomVisibleBase = range(0, column).map(() => 0);
	const leftVisibleBase = range(0, row).map(() => 0);

	let result = 0n;

	contents.forEach((content, i) => {
		const trees = content.split('');

		trees.forEach((tree, j) => {
			const height = parseInt(tree, 10);

			// Right visible
			if (height > rightVisibleBase[i]) {
				rightVisibleBase[i] = height;
				visibleMap[i][j]++;
			}

			// Top visible
			if (height > topVisibleBase[j]) {
				topVisibleBase[j] = height;
				visibleMap[i][j]++;
			}

			map[i][j] = height;
		});
	});

	contents.reverse().forEach((content, i) => {
		const trees = content.split('').reverse();

		trees.forEach((tree, j) => {
			const height = parseInt(tree, 10);
			const realIPosition = contents.length - i - 1;
			const realJPosition = trees.length - j - 1;

			// Right visible
			if (height > leftVisibleBase[realIPosition]) {
				leftVisibleBase[realIPosition] = height;
				visibleMap[realIPosition][realJPosition]++;
			}

			// Top visible
			if (height > bottomVisibleBase[realJPosition]) {
				bottomVisibleBase[realJPosition] = height;
				visibleMap[realIPosition][realJPosition]++;
			}
		});
	});
	// console.log('Visible map:', visibleMap);c

	let nonVisibleNumber = 0;

	for (let i = 1; i < row - 1; i++) {
		for (let j = 1; j < column - 1; j++) {
			if (visibleMap[i][j] === 0) {
				nonVisibleNumber++;
			}
		}
	}

	console.log('Result', row * column - nonVisibleNumber);
	// console.log('Map', map);

	let result2 = {
		score: 0,
		x: 0,
		y: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	};

	for (let i = 1; i < row - 1; i++) {
		for (let j = 1; j < column - 1; j++) {
			const scoreResult = visibleCalculate(map, scoreMap, { x: j, y: i });

			// console.log('=====', j, i, scoreResult);
			scoreMap[i][j] = scoreResult;

			if (scoreResult.score > result2.score) {
				result2 = scoreResult;
				result2.x = j;
				result2.y = i;
			}
		}
	}

	// console.log(scoreMap);

	console.log('Part 2 result', result2);
} catch (err) {
	console.error(err);
}
