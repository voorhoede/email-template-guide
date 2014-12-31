var paths = {
	src: 'src/',
	srcComponents: 'src/components/',
	srcVendor: 'src/vendor/',
	srcViews: 'src/views/',
	dist: 'dist/',
	distAssets: 'dist/assets/',
	distComponents: 'dist/components/',
	distViews: 'dist/views/',
	karmaConfig:'./test/karma.conf.js',
	changelog:'CHANGELOG.md'
};
paths.assetFiles = [
		paths.src + 'assets/**/*.*',
		paths.srcComponents + '*/assets/**/*.*',
		paths.srcViews + '*/assets/**/*.*'
];
// source files are all files directly in module sub directories and core files,
// excluding abstract files/dirs starting with '_'.
paths.srcFiles = [
		paths.src + '*',
		paths.srcComponents + '*/*',
		paths.srcViews + '*/*',
		'!' + paths.src + '*/_template/*'
];
paths.htmlFiles = paths.srcFiles.map(function(path){ return path + '.html'; });
paths.lessFiles = paths.srcFiles.map(function(path){ return path + '*/*.less'; });

module.exports = {
	paths: paths
};
