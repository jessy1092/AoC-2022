import { readFile } from 'node:fs/promises';

try {
	const filePath = new URL('./data1', import.meta.url);
	const data = await readFile(filePath, { encoding: 'utf8' });

	const contents = data.split('\n');

	let maxThree = [];
	let calories = 0;

	contents.forEach(content => {
		const num = parseInt(content);

		if (isNaN(num)) {
			maxThree = [...maxThree, calories].sort((a, b) => b - a).slice(0, 3);
			// max = max > calories ? max : calories;

			calories = 0;
		} else {
			calories += num;
		}
	});

	maxThree = [...maxThree, calories].sort((a, b) => b - a).slice(0, 3);

	console.log('Max', maxThree[0]);

	console.log(
		'Top three total',
		maxThree.reduce((p, c) => p + c, 0),
	);
} catch (err) {
	console.error(err);
}
