
var path = require('path');
var fs = require('node-fs');
var bower = require('bower');
var mustache = require('mustache');
var requirejs = require('requirejs/bin/r.js');

mustache.escape = function (x) { return x; };

module.exports = function (root, verbose, done) {

	var bowerCfg, packageCfg;

	try {
		bowerCfg = require(path.join(root,'bower.json'));
	} catch(e) {
		throw new Error("bower.json not found!");
	}
	try {
		packageCfg = require(path.join(root,'package.json'));
	} catch(e) {
		throw new Error("package.json not found!");
	}

	var context = {
		packageName: bowerCfg.name,
		globalName: bowerCfg['amd-dist'] && bowerCfg['amd-dist']['global'] || bowerCfg.name
	};

	if (verbose) console.log("Package Name:", context.packageName);
	if (verbose) console.log("Browser Global Name:", context.globalName);

	bower.commands
		.list({paths: true})
		.on('end', onDeps)
		.on('error', function(error) {
		  console.error(error);
		});

	function onDeps (deps) {
		if (verbose) console.log("Found Dependencies:", deps);
		context.deps = Object.keys(deps).map(function (dep) {

			// Todo: mapping between dependency package name & browser global name
			return {
				name: dep,
				global: dep,
				path: deps[dep].slice(0, deps[dep].lastIndexOf('.js'))
			}
		});

		context.main = packageCfg.main;
		if (verbose) console.log("Main:", context.main);

		context.buildDir = path.join(root, 'build');
		if (verbose) console.log("Build Dir:", context.buildDir);
		fs.mkdirSync(context.buildDir, null, true);

		context.dist = path.join(bowerCfg.main).replace(/\\/g, '/');
		if (verbose) console.log("Output Path:", context.dist);

		writeTemplate('start.wrap.mustache.js', context);
		writeTemplate('end.wrap.mustache.js', context);
		writeTemplate('build.mustache.json', context);

		console.log("Running r.js optimizer...");
		requirejs.optimize(require(path.join(context.buildDir, 'build.json')), done);
	}


	function writeTemplate(template, context) {
		var result = mustache.render(
			fs.readFileSync(path.join(__dirname, '../templates/', template), 'ascii'),
			context
		);

		if (verbose) console.log("Writing:", path.join(context.buildDir, template.replace('.mustache', '')));

		fs.writeFileSync(path.join(context.buildDir, template.replace('.mustache', '')), result, 'ascii');
	}

};
