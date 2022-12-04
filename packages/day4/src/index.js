import { readFile } from 'node:fs/promises';

try {
	const filePath = new URL('./data', import.meta.url);
	const data = await readFile(filePath, { encoding: 'utf8' });

	const contents = data.split('\n');

	let score = 0;

	contents.forEach(content => {
		if (content === '') {
			return;
		}
		const [pair1, pair2] = content.split(',');

		const [pair1Num1, pair1Num2] = pair1.split('-');
		const [pair2Num1, pair2Num2] = pair2.split('-');

		if (
			(parseInt(pair1Num1) <= parseInt(pair2Num1) && parseInt(pair1Num2) >= parseInt(pair2Num2)) ||
			(parseInt(pair1Num1) >= parseInt(pair2Num1) && parseInt(pair1Num2) <= parseInt(pair2Num2))
		) {
			score++;
		}
	});

	console.log('Score', score);

	let score2 = 0;

	contents.forEach(content => {
		if (content === '') {
			return;
		}
		const [pair1, pair2] = content.split(',');

		const [pair1Num1, pair1Num2] = pair1.split('-');
		const [pair2Num1, pair2Num2] = pair2.split('-');

		if (parseInt(pair1Num2) >= parseInt(pair2Num1) && parseInt(pair1Num1) <= parseInt(pair2Num2)) {
			score2++;
		}
	});

	console.log('Part 2 score', score2);
} catch (err) {
	console.error(err);
}
