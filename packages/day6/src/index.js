import { readFile } from 'node:fs/promises';

export const range = (start, length) => Array.from(new Array(length), (_, i) => start + i);

try {
	const filePath = new URL('./data', import.meta.url);
	const data = await readFile(filePath, { encoding: 'utf8' });

	const contents = data.split('\n');

	const charMap = {};

	let result = 0;

	let lastestDuplicateIndex = [];

	for (let i = 0; i < contents[0].length; i++) {
		const char = contents[0][i];

		console.log('round', i, 'last', lastestDuplicateIndex, 'char', char);

		if (typeof charMap[char] !== 'undefined') {
			lastestDuplicateIndex.push(charMap[char].index);

			console.log('update', char, ' ', i);

			charMap[char].index = i;
		} else {
			charMap[char] = { index: i };
		}

		const checkIndex = lastestDuplicateIndex.filter(oldIndex => i - oldIndex < 4);

		console.log('check', checkIndex);

		if (checkIndex.length == 0 && i >= 4) {
			result = i + 1;
			break;
		}
	}

	console.log('Result', result);

	const charMap2 = {};

	let result2 = 0;

	let lastestDuplicateIndex2 = [];

	for (let i = 0; i < contents[0].length; i++) {
		const char = contents[0][i];

		// console.log('round', i, 'last', lastestDuplicateIndex2, 'char', char);

		if (typeof charMap2[char] !== 'undefined') {
			lastestDuplicateIndex2.push(charMap2[char].index);

			// console.log('update', char, ' ', i);

			charMap2[char].index = i;
		} else {
			charMap2[char] = { index: i };
		}

		const checkIndex = lastestDuplicateIndex2.filter(oldIndex => i - oldIndex < 14);

		// console.log('check', checkIndex);

		if (checkIndex.length == 0 && i >= 14) {
			result2 = i + 1;
			break;
		}
	}

	console.log('Part 2 result', result2);
} catch (err) {
	console.error(err);
}
