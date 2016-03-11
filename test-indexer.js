const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');

const config = {
	bufferSize: 4096,
	testDirectory: 'profile_pictures'
}

function indexDirectory (directory) {
	fs.readdirSync(directory).forEach(function(entry) {
		try	{
			var fullpath = path.join(directory, entry);
			var fileinfo = fs.statSync(fullpath);
			if (fileinfo.isFile())	{
				indexFile(fullpath);
			} else if(fileinfo.isDirectory()) {
				indexDirectory(fullpath);
			}		
		} catch (err) {
			console.log(err);
		}
	});
}


var files = new Set();
var struct = Object.create(null);
struct.files = [];
function insertFileElement (file, hash) {
	files.add(hash);

	var dirinfo = path.parse(file);
	var dirtree = path.relative(config.testDirectory, dirinfo.dir).split(path.sep).filter(directory => directory.trim() !== '');

	var object = struct;
	dirtree.forEach(directory => {
			if (object[directory]) {
				object = object[directory];
			} else {
				object[directory] = {files:[]};
			}
		}
	);
	
	object.files.push({name: dirinfo.base, guid: hash});
}

function indexFile (file) {
	const buffer = new Buffer(config.bufferSize);
	const hash = crypto.createHash('sha1');
	const fd = fs.openSync(file, 'r');

	var toRead = 0;
	while (0!==(toRead =fs.readSync(fd, buffer, 0, config.bufferSize))) {
		hash.update(buffer.slice(0, toRead));
	}

	insertFileElement(file, hash.digest('hex'))
}

indexDirectory(config.testDirectory);


console.dir(struct, {depth:16, colors:true});
console.log(files.size);

/*
Generate a tree structure from a directory
{
	files: [{name: 'name', guid: 'guid'}],
}



*/