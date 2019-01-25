/**
 * Transforms JSX .html files in a SOURCE directory into hypertext javascript code
 * and writes .js files into DEST directory.
 *
 * Usage:
 * >>> node jsxtransform.js SOURCE DEST
 *
 * Author: Asif Rahman
 * Created: 2018-09-17
 */
var fs = require('fs');
var path = require('path');
var jsx = require('jsx-transform');

if (process.argv.length <= 2) {
	console.log("Usage: " + __filename + " SOURCE DEST");
	process.exit(-1);
}

function fromDir(startPath, filter, cb){
	if (!fs.existsSync(startPath)){
		console.log("no dir ",startPath);
		return;
	}
	var files=fs.readdirSync(startPath);
	for(var i=0;i<files.length;i++){
		var filename=path.join(startPath,files[i]);
		var stat = fs.lstatSync(filename);
		if (stat.isDirectory()){
			fromDir(filename,filter); //recurse
		}
		else if (filename.indexOf(filter)>=0) {
			if (cb) { cb(filename); };
		};
	};
};

var source = path.resolve(process.argv[2]);
var dest = path.resolve(process.argv[3]);

console.log('Parsing .html in', source, 'and moving to', dest)

fromDir(source,'.html', function (filename) {
	console.log('Parsing', filename);
	var name = path.parse(filename).name;
	var hypertext = jsx.fromFile(filename, {factory: 'h'});
	var parsedfile = path.resolve(path.join(dest, name + '.js'));
	// wrap the hypertext in a method call named for the filename
	var parsed = 'var ' + name + ' = function (component){ var self = this; \nreturn ' + hypertext + ' };\n';
	fs.writeFile(parsedfile, parsed, function(err) {
		if(err) { return console.log(err); };
	});
});