import { readFile } from 'node:fs/promises';

const Play1Map = {
	A: 1,
	B: 2,
	C: 3,
};

const Play2Map = {
	X: 1,
	Y: 2,
	Z: 3,
};

const Play3Map = {
	X: 0,
	Y: 3,
	Z: 6,
};

try {
	const filePath = new URL('./data', import.meta.url);
	const data = await readFile(filePath, { encoding: 'utf8' });

	const contents = data.split('\n');

	let score = 0;

	contents.forEach(content => {
		if (content === '') {
			return;
		}

		const [play1Data, play2Data] = content.split(' ');

		const play1 = Play1Map[play1Data];
		const play2 = Play2Map[play2Data];
		const isReverse = Math.abs(play2 - play1) === 2;

		score += play2;

		if (play2 === play1) {
			score += 3;
		} else if ((play2 > play1 && !isReverse) || (play2 < play1 && isReverse)) {
			score += 6;
		}
	});

	console.log('Score', score);

	let score2 = 0;

	contents.forEach(content => {
		if (content === '') {
			return;
		}

		const [play1Data, play3Data] = content.split(' ');

		const play1 = Play1Map[play1Data];
		const play3 = Play3Map[play3Data];

		score2 += play3;

		if (play3 === 0) {
			const play2 = play1 == 1 ? 3 : play1 - 1;

			score2 += play2;
		} else if (play3 == 3) {
			score2 += play1;
		} else if (play3 == 6) {
			const play2 = play1 == 3 ? 1 : play1 + 1;

			score2 += play2;
		}
	});

	console.log('Part 2 score', score2);
} catch (err) {
	console.error(err);
}
