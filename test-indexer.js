const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');

const config = {
	bufferSize: 4096,
	testDirectory: 'test-indexer'
}

function indexDirectory (directory, name) {
	var directories = [];
	var files = [];
	fs.readdirSync(directory).forEach(function(entry) {
		try	{
			var fullpath = path.join(directory, entry);
			var fileinfo = fs.statSync(fullpath);
			if (fileinfo.isFile())	{
				files.push(indexFile(fullpath, entry));
			} else if(fileinfo.isDirectory()) {
				directories.push(indexDirectory(fullpath, entry));
			}		
		} catch (err) {
			console.log(err);
		}
	});
	return {name, directories, files};
}

function indexFile (file, name) {
	const buffer = new Buffer(config.bufferSize);
	const hash = crypto.createHash('sha1');
	const fd = fs.openSync(file, 'r');

	var toRead = 0;
	while (0!==(toRead =fs.readSync(fd, buffer, 0, config.bufferSize))) {
		hash.update(buffer.slice(0, toRead));
	}

	const guid = hash.digest('hex');
	return {name, guid};
}

const struct = indexDirectory(config.testDirectory, 'ROOT');
console.dir(struct, {depth:16, colors:true});
//console.log(files.size);