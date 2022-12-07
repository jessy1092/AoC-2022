import { readFile } from 'node:fs/promises';

export const range = (start, length) => Array.from(new Array(length), (_, i) => start + i);

BigInt.prototype.toJSON = function () {
	return this.toString();
};

const basicType = {
	parent: null,
	child: [],
	size: 0n,
	type: 'dir', // 'file
};

const execute = (context, currentFS, command) => {
	if (command == '') {
		return currentFS;
	}

	const [symbol, ...otherCommand] = command.split(' ');

	if (symbol === '$') {
		const [cmd, action] = otherCommand;

		if (cmd == 'cd') {
			if (action == '/') {
				return '/';
			}

			if (action == '..') {
				return context[currentFS].parent;
			}

			return `${currentFS}-${action}`;
		}

		if (cmd == 'ls') {
			return currentFS;
		}
	}

	if (symbol == 'dir') {
		const [dirName] = otherCommand;

		const absoluteDirName = `${currentFS}-${dirName}`;

		context[absoluteDirName] = {
			parent: currentFS,
			child: [],
			size: 0n,
			type: 'dir', // 'file
		};

		context[currentFS].child.push(absoluteDirName);

		return currentFS;
	}

	const [fileName] = otherCommand;

	const absoluteFileName = `${currentFS}-${fileName}`;

	const fileSize = BigInt(symbol);

	context[absoluteFileName] = {
		parent: currentFS,
		child: [],
		size: fileSize,
		type: 'file', // 'file
	};

	context[currentFS].size += fileSize;

	let indexFS = currentFS;

	while (indexFS !== '/') {
		indexFS = context[indexFS].parent;

		context[indexFS].size += fileSize;
	}

	context[currentFS].child.push(absoluteFileName);

	return currentFS;
};

const BFStrace = (FileSystem, currentFS, target) => {
	const currentSize = FileSystem[currentFS].size;
	const diffSize = currentSize - target.needSize;

	if (FileSystem[currentFS].type === 'dir' && currentSize >= target.needSize) {
		if (diffSize < target.diffSize) {
			target.diffSize = diffSize;
			target.pointFS = currentFS;
		}

		const childTarget = FileSystem[currentFS].child
			.map(childFS => {
				return BFStrace(FileSystem, childFS, target);
			})
			.sort((a, b) => parseInt(a.diffSize - b.diffSize))[0];

		if (childTarget.diffSize < target.diffSize) {
			return childTarget;
		}
		return target;
	}

	return target;
};

try {
	const filePath = new URL('./data', import.meta.url);
	const data = await readFile(filePath, { encoding: 'utf8' });

	const contents = data.split('\n');

	const FileSystem = {
		'/': {
			parent: '/',
			child: [],
			size: 0n,
			type: 'dir', // 'file
		},
	};

	let result = 0n;

	let removeFS = [];

	let currentFS = '/';

	contents.forEach(command => {
		// console.log('execute command', command);
		// console.log('File System', JSON.stringify(FileSystem, null, '  '));

		currentFS = execute(FileSystem, currentFS, command);

		if (removeFS.includes(currentFS) && FileSystem[currentFS].size > 100000) {
			removeFS = removeFS.filter(f => f !== currentFS);
		}

		if (!removeFS.includes(currentFS) && FileSystem[currentFS].size <= 100000) {
			removeFS.push(currentFS);
		}
	});

	removeFS.forEach(fs => {
		result += FileSystem[fs].size;
	});

	console.log('Total Size', FileSystem['/'].size);
	console.log('Remove FS', removeFS);
	console.log('Result', result);

	const needSize = FileSystem['/'].size - 40000000n;

	const target = BFStrace(FileSystem, '/', { needSize, diffSize: 30000000n, pointFS: '/' });

	console.log(target);
	console.log(FileSystem[target.pointFS]);

	console.log('Part 2 result', FileSystem[target.pointFS].size);
} catch (err) {
	console.error(err);
}
