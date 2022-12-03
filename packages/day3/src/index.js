import { readFile } from 'node:fs/promises';

try {
	const filePath = new URL('./data', import.meta.url);
	const data = await readFile(filePath, { encoding: 'utf8' });

	const contents = data.split('\n');

	let score = 0;

	contents.forEach(content => {
		const length = content.length;

		const CheckMap = {};

		for (let i = 0; i < length; i++) {
			const character = content[i];

			const isCheck = CheckMap[character];

			if (i < length / 2.0) {
				CheckMap[character] = typeof isCheck === 'undefined' ? 1 : isCheck + 1;
			} else {
				if (typeof isCheck !== 'undefined') {
					if (
						character.charCodeAt(0) >= 'a'.charCodeAt(0) &&
						character.charCodeAt(0) <= 'z'.charCodeAt(0)
					) {
						score += character.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
					} else {
						score += character.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
					}

					break;
				}
			}
		}
	});

	console.log('Score', score);

	let score2 = 0;

	for (let i = 0; i < (contents.length - 1) / 3; i++) {
		const CheckMap = {};

		contents[i * 3].split('').forEach(s => {
			CheckMap[s] = 1;
		});

		contents[i * 3 + 1].split('').forEach(s => {
			if (CheckMap[s] === 1) {
				CheckMap[s] = 2;
			}
		});

		let isCalculate = false;

		contents[i * 3 + 2].split('').forEach(character => {
			if (CheckMap[character] === 2 && !isCalculate) {
				if (
					character.charCodeAt(0) >= 'a'.charCodeAt(0) &&
					character.charCodeAt(0) <= 'z'.charCodeAt(0)
				) {
					score2 += character.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
				} else {
					score2 += character.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
				}
				isCalculate = true;
			}
		});
	}

	console.log('Part 2 score', score2);
} catch (err) {
	console.error(err);
}
