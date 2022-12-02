import { readFile } from 'node:fs/promises';

try {
	const filePath = new URL('./data1', import.meta.url);
	const data = await readFile(filePath, { encoding: 'utf8' });

	const contents = data.split('\n');

	let max = 0;
	let calories = 0;

	contents.forEach(content => {
		const num = parseInt(content);

		if (isNaN(num)) {
			max = max > calories ? max : calories;

			calories = 0;
		} else {
			calories += num;
		}
	});

	max = max > calories ? max : calories;

	console.log(max);
} catch (err) {
	console.error(err);
}
