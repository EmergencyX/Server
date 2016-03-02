let grpc = require('grpc');
let fs = require('fs');
let crypto = require('crypto');

const Brotli = require('iltorb');
const Filesystem = grpc.load('proto/Filesystem.proto');
const dummyUseProto = true;
 

let fileCount = 0;
let directoryCount = 0;

function createTest() {
	let data = {
		name: 'Fubar',
		children:  createTestDirectories(10, 3, 0),
		files:  createTestFiles(15)
	};
	if (dummyUseProto) {
		return new Filesystem.Directory(data);
	}
	return data;
}

function createTestDirectories(count, limit, current) {
	let directories = [];

	if (current < limit) {
		for (let i = 0; i < count; i++) {
			directoryCount++;
			directories.push(createTestDirectory(count, limit, current));
		};
	}
	
	return directories;
}

function createTestFiles(count) {
	let files = [];
	for (let i = 0; i < count; i++) {
		fileCount++;
		files.push(createTestFile());
	};
	
	return files;
}

function createTestDirectory(count, limit, current) {
	let directory = {
		name: crypto.createHash('sha1').update('directory' + directoryCount).digest('hex'),
		children: createTestDirectories(count, limit, current + 1),
		files: createTestFiles(30)
	};
	if (dummyUseProto) {
		return new Filesystem.Directory(directory);
	}
	return directory;
}

function createTestFile() {
	let file = {guid: crypto.createHash('sha1').update('file' + fileCount).digest('hex')};
	if (dummyUseProto) {
		return new Filesystem.File(file);
	}
	return file;
}

let test = createTest();

if (dummyUseProto) {
	let encode = test.toBuffer();
	console.log(test);
	fs.writeFileSync('test.proto', encode);

	fs.writeFileSync('test.proto.brotli', Brotli.compressSync(encode));
} else {
	let json = JSON.stringify(test);
	console.log(json);
	fs.writeFileSync('test.json', json);

	fs.writeFileSync('test.json.brotli', Brotli.compressSync(new Buffer(json)));
}


console.log('Files', fileCount);
console.log('Directories', directoryCount);