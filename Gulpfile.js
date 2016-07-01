'use strict';

// Core: gulp
var gulp             = require('gulp');

// Dependencies (A-Z)
var _                = require('lodash');
var browserSync      = require('browser-sync');
var del              = require('del');
var emailUtility     = require('./lib/email-sender');
var filter           = require('gulp-filter');
var fs               = require('fs');
var gulpIf           = require('gulp-if');
var inlineCss        = require('gulp-inline-css');
var litmus           = require('gulp-litmus');
var moduleUtility    = require('./lib/module-utility');
var newer            = require('gulp-newer');
var notify           = require('gulp-notify');
var nunjucksMarkdown = require('nunjucks-markdown');
var nunjucksRender   = require('./lib/nunjucks-render');
var path             = require('path');
var plumber          = require('gulp-plumber');
var prism            = require('./lib/prism');
var rename           = require('gulp-rename');
var replace          = require('gulp-replace');
var runSequence      = require('run-sequence');
var sass             = require('gulp-sass');
var util             = require('gulp-util');

// Shared configuration (A-Z)
var config           = require('./config.js');
var paths            = config.paths;
var pkg              = require('./package.json');
var isWatching       = false;

// Register default & custom tasks (A-Z)
gulp.task('default', ['build_guide']);
gulp.task('build_clean', function(cb) { runSequence('clean_dist', 'build_scss', 'build_html', cb); });
gulp.task('build_guide', function(cb) { runSequence('build_clean', 'build_previews', 'inline_css', 'build_module_info', cb); });
gulp.task('build_html', buildHtmlTask);
gulp.task('build_scss', buildScssTask);
gulp.task('build_module_info', buildModuleInfoTask);
gulp.task('build_previews', buildPreviewsTask);
gulp.task('clean_dist', cleanDistTask);
gulp.task('create_module', createModule);
gulp.task('edit_module', editModule);
gulp.task('email_test', sendEmailTest);
gulp.task('inline_css', inlineCssTask);
gulp.task('remove_module', removeModule);
gulp.task('serve', serveTask);
gulp.task('watch', function () { runSequence('build_guide', 'serve', watchTask); });
gulp.task('zip_dist', zipDistTask);

// Tasks and utils (A-Z)

function buildHtmlTask() {
	configureNunjucks();
	var moduleIndex = moduleUtility.getModuleIndex();
	return srcFiles('html')
		.pipe(plumber()) // prevent pipe break on nunjucks render error
		.pipe(nunjucksRender(function(file){
			return _.extend(
				htmlModuleData(file),
				{ moduleIndex: moduleIndex }
			);
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest(paths.dist))
		.pipe(reloadBrowser({ stream:true }));
}

function buildModuleInfoTask() {
	var MarkdownIt = require('markdown-it');
	var md = new MarkdownIt();
	['Components', 'Views'].forEach(function(moduleType){
		listDirectories(paths['src' + moduleType])
			.filter(function(name){ return (name.substr(0,1) !== '_'); })
			.map(function(name){
				var srcBasename  = paths['src' + moduleType]  + name + '/' + name;
				var distBasename = paths['dist' + moduleType] + name + '/' + name;
				var moduleInfo = {
					name: name,
					readme  : md.render(getFileContents(paths['src' + moduleType]  + name + '/README.md')),
					html    : highlightCode(getFileContents(distBasename + '.html'), 'markup'),
					css    : highlightCode(getFileContents(srcBasename + '.less'), 'css')
				};
				fs.writeFileSync(distBasename + '-info.json', JSON.stringify(moduleInfo, null, 4));
			});
	});
}

function buildPreviewsTask() {
	configureNunjucks();
	var templateHtml = fs.readFileSync(paths.srcViews + '_component-preview/component-preview.html', 'utf8');
	return gulp.src(paths.srcComponents + '*/*.html', { base: paths.src })
		.pipe(plumber()) // prevent pipe break on nunjucks render error
		.pipe(nunjucksRender(htmlModuleData))
		.pipe(nunjucksRender(htmlModuleData, templateHtml))
		.pipe(plumber.stop())
		.pipe(rename(function(p){ p.basename += '-preview'; }))
		.pipe(gulp.dest(paths.dist));
}

function buildScssTask() {
	return gulp.src(['./src/index.scss', './src/views/_guide-viewer/guide-viewer.scss'])
		.pipe(plumber()) // prevent pipe break on scss parsing
		.pipe(gulpIf(isWatching, plumber({
			errorHandler: notify.onError(function (err) {
				return err.message
					.replace(/.*(\/.*\.scss)/, '.. $1')
					.replace('\n', ': ');
			})
		})))
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(plumber.stop())
		.pipe(rename(function(p){
			if(p.dirname === '.'){ p.dirname = 'assets'; } // output root src files to assets dir
		}))
		//should filter the template files and generate for them the css in src.
		.pipe(gulp.dest(paths.dist)) // write the css and source maps
		.pipe(filter('**/*.css')); // filtering stream to only css files
}

function configureNunjucks() {
	var env = nunjucksRender.nunjucks.configure(paths.src);
	nunjucksMarkdown.register(env);
	env.addFilter('match', require('./lib/nunjucks-filter-match'));
	env.addFilter('prettyJson', require('./lib/nunjucks-filter-pretty-json'));
}

function createModule() {
	return moduleUtility.create();
}

function editModule() {
	return moduleUtility.edit();
}

function removeModule() {
	return moduleUtility.remove();
}

function inlineCssTask() {
	return gulp.src([
			paths.dist + '**/!(_**)/*.html',
			'!dist/components/app-core-styles/*.*'
		])
		.pipe(inlineCss({
			applyStyleTags: true,
			applyLinkTags: true,
			removeStyleTags: true,
			removeLinkTags: true,
			preserveMediaQueries: true
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(reloadBrowser({ stream:true }))
		.on('error', util.log);
}


function getFileContents(path){
	if(fs.existsSync(path)){
		return fs.readFileSync(path, 'utf8');
	} else {
		return '';
	}
}

/**
 * Use PrismJS in Node: https://github.com/LeaVerou/prism/pull/179
 * @param {string} code
 * @param {string} lang
 * @returns {string}
 */
function highlightCode(code, lang){
	if(!code.length){ return code; }
	code = prism.highlight(code, prism.languages[lang]);
	code = '<pre class="language-' + lang + '"><code>' + code + '</code></pre>';
	return code;
}

function htmlModuleData(file) {
	var pathToRoot = path.relative(file.relative, '.');
	pathToRoot = pathToRoot.substring(0, pathToRoot.length - 2);
	return {
		module: {
			id: path.dirname(file.relative),
			name: parsePath(file.relative).basename,
			html: file.contents.toString()
		},
		paths: {
			assets: pathToRoot + 'assets/',
			root: pathToRoot
		},
		pkg: pkg
	};
}

function listDirectories(cwd) {
	return fs.readdirSync(cwd)
		.filter(function(file){
			return fs.statSync(cwd + file).isDirectory();
		});
}

function parsePath(filepath) {
	var extname = path.extname(filepath);
	return {
		dirname: path.dirname(filepath),
		basename: path.basename(filepath, extname),
		extname: extname
	};
}

function reloadBrowser(options){
	// only reload browserSync if active, otherwise causes an error.
	return gulpIf(browserSync.active, browserSync.reload(options));
}

function sendEmailTest() {
	return emailUtility.sendEmail();
}

function cleanDistTask() {
	del([paths.dist]);
}

function serveTask() {
	// http://www.browsersync.io/docs/gulp/
	browserSync({
		server: {
			baseDir: paths.dist
		}
	});
}

function srcFiles(filetype) {
	return gulp.src(paths.srcFiles, { base: paths.src })
		.pipe(filter('**/*.' + filetype));
}

function watchTask () {
	gulp.watch(paths.htmlFiles, ['build_scss', 'build_html', 'build_previews']);
	gulp.watch(paths.scssFiles, function() { runSequence('build_scss', 'build_html', 'build_previews', 'inline_css'); });
}

function zipDistTask () {
	return gulp.src(paths.dist + '**/*')
		.pipe(zip(pkg.name + '.zip'))
		.pipe(gulp.dest(paths.dist));
}
