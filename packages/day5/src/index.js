import { readFile } from 'node:fs/promises';

export const range = (start, length) => Array.from(new Array(length), (_, i) => start + i);

const transformStack = stackContents => {
	const StackMap = {};
	let stackNumber = 0;

	stackContents[stackContents.length - 1]
		.split(' ')
		.filter(c => c !== '')
		.forEach(stackIndex => {
			StackMap[stackIndex] = [];

			for (let i = 0; i < stackContents.length - 1; i++) {
				// console.log(stackIndex);
				const crate = stackContents[i][(parseInt(stackIndex) - 1) * 4 + 1];

				if (crate !== ' ') {
					// console.log('crate', crate);
					StackMap[stackIndex].push(crate);
				}
			}

			stackNumber++;
		});

	console.log('Stack number', stackNumber);
	console.log('Full Stack', JSON.stringify(StackMap));

	return { StackMap, stackNumber };
};

const transformMove = moveContent => {
	const regex = /move (\d+) from (\d+) to (\d+)/;

	const numbers = moveContent.match(regex).slice(1);

	return numbers;
};

try {
	const filePath = new URL('./data', import.meta.url);
	const data = await readFile(filePath, { encoding: 'utf8' });

	const contents = data.split('\n');

	const split = contents.findIndex(c => c == '');

	const stackContents = contents.slice(0, split);
	const moveContents = contents.slice(split + 1, contents.length - 1);

	// console.log(stackContents);
	// console.log(moveContents);

	const { StackMap, stackNumber } = transformStack(stackContents);

	moveContents.forEach(moveContent => {
		const [stacks, from, to] = transformMove(moveContent);

		const moveStack = StackMap[from].slice(0, stacks);
		StackMap[from] = StackMap[from].slice(stacks, StackMap[from].length);

		StackMap[to] = [...moveStack.reverse(), ...StackMap[to]];
	});

	const result = range(1, stackNumber)
		.map(i => StackMap[i][0])
		.join('');

	console.log('Result', result);

	const { StackMap: StackMap2 } = transformStack(stackContents);

	moveContents.forEach(moveContent => {
		const [stacks, from, to] = transformMove(moveContent);

		const moveStack = StackMap2[from].slice(0, stacks);
		StackMap2[from] = StackMap2[from].slice(stacks, StackMap2[from].length);

		StackMap2[to] = [...moveStack, ...StackMap2[to]];
	});

	const result2 = range(1, stackNumber)
		.map(i => StackMap2[i][0])
		.join('');

	console.log('Part 2 result', result2);
} catch (err) {
	console.error(err);
}
