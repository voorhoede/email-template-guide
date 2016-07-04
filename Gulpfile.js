'use strict';

// Core: gulp
var gulp             = require('gulp');

// Dependencies (A-Z)
var _                = require('lodash');
var browserSync      = require('browser-sync').create();
var cleanCSS         = require('gulp-clean-css');
var del              = require('del');
var emailUtility     = require('./lib/email-sender');
var filter           = require('gulp-filter');
var fs               = require('fs');
var gmq              = require('gulp-get-media-queries');
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
var removeEmptyLines = require('gulp-remove-empty-lines');
var rename           = require('gulp-rename');
var replace          = require('gulp-replace');
var runSequence      = require('run-sequence');
var sass             = require('gulp-sass');
var util             = require('gulp-util');
var zip              = require('gulp-zip');

// Shared configuration (A-Z)
var config           = require('./config.js');
var paths            = config.paths;
var pkg              = require('./package.json');
var isWatching       = false;

// Register default & custom tasks (A-Z)
gulp.task('default', ['build_guide']);
gulp.task('build_guide', function (cb) { runSequence('build_clean', 'build_previews', 'build_responsive', 'build_module_info', cb); });
gulp.task('build_clean', function (cb) { runSequence('clean_dist', 'build_scss', 'build_html', cb); });
gulp.task('build_responsive', function (cb) { runSequence('inline_css', 'seperate_mediaqueries', 'insert_mediaqueries', cb); });
gulp.task('build_html', buildHtmlTask);
gulp.task('build_scss', buildScssTask);
gulp.task('build_module_info', buildModuleInfoTask);
gulp.task('build_previews', buildPreviewsTask);
gulp.task('clean_dist', cleanDistTask);
gulp.task('create_module', createModule);
gulp.task('edit_module', editModule);
gulp.task('email_test', sendEmailTest);
gulp.task('inline_css', inlineCssTask);
gulp.task('insert_mediaqueries', insertMediaqueriesTask);
gulp.task('remove_module', removeModule);
gulp.task('seperate_mediaqueries', seperateMediaqueriesTask);
gulp.task('serve', serveTask);
gulp.task('watch', function () { runSequence('build_guide', 'serve', watchTask); });
gulp.task('zip_dist', zipDistTask);

// Tasks and utils (A-Z)

/**
 * Build HTML task. Renders the HTML by parsing the Nunjucks templates.
 * @returns {*}
 */
function buildHtmlTask() {
    configureNunjucks();
    var moduleIndex = moduleUtility.getModuleIndex();
    return srcFiles('html')
        .pipe(plumber()) // prevent pipe break on nunjucks render error
        .pipe(nunjucksRender(function (file) {
            return _.extend(
                htmlModuleData(file),
                {moduleIndex: moduleIndex}
            );
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.dist))
        .pipe(reloadBrowser({stream: true}));
}

/**
 * Build module info task.
 * Builds the module info used by the components/views in the guide.
 */
function buildModuleInfoTask() {
    var MarkdownIt = require('markdown-it');
    var markdown = new MarkdownIt({
        highlight: function (str, lang) {
            return prism.highlight(str, prism.languages[lang || 'markup']);
        }
    });
    ['Components', 'Views'].forEach(function (moduleType) {
        listDirectories(paths['src' + moduleType])
            .filter(function (name) {
                return (name.substr(0, 1) !== '_');
            })
            .map(function (name) {
                var srcBasename = paths['src' + moduleType] + name + '/' + name;
                var distBasename = paths['dist' + moduleType] + name + '/' + name;
                var moduleInfo = {
                    name: name,
                    readme: markdown.render(getFileContents(paths['src' + moduleType] + name + '/README.md')),
                    html: highlightCode(getFileContents(distBasename + '.html'), 'markup'),
                    scss: highlightCode(getFileContents(srcBasename + '.scss'), 'css')
                };
                fs.writeFileSync(distBasename + '-info.json', JSON.stringify(moduleInfo, null, 4));
            });
    });
}

/**
 * Build previews task.
 * Builds the previews used in the guide.
 */
function buildPreviewsTask() {
    configureNunjucks();
    var templateHtml = fs.readFileSync(paths.srcViews + '_component-preview/component-preview.html', 'utf8');
    return gulp.src(paths.srcComponents + '*/*.html', {base: paths.src})
        .pipe(plumber()) // prevent pipe break on nunjucks render error
        .pipe(removeEmptyLines())
        .pipe(nunjucksRender(htmlModuleData))
        .pipe(nunjucksRender(htmlModuleData, templateHtml))
        .pipe(plumber.stop())
        .pipe(rename(function (p) {
            p.basename += '-preview';
        }))
        .pipe(gulp.dest(paths.dist));
}

/**
 * Build scss task. Builds the .dist/assets/index.css file.
 * This file is used by inlineCssTask.
 */
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
        .pipe(rename(function (p) {
            if (p.dirname === '.') {
                p.dirname = 'assets';
            } // output root src files to assets dir
        }))
        //should filter the template files and generate for them the css in src.
        .pipe(gulp.dest(paths.dist)) // write the css and source maps
        .pipe(filter('**/*.css')); // filtering stream to only css files
}

/**
 * configure Nunjucks task.
 */
function configureNunjucks() {
    var env = nunjucksRender.nunjucks.configure(paths.src);
    nunjucksMarkdown.register(env);
    env.addFilter('match', require('./lib/nunjucks-filter-match'));
    env.addFilter('prettyJson', require('./lib/nunjucks-filter-pretty-json'));
}

/**
 * Create module task.
 * To use: `npm run add-module`
 */
function createModule() {
    return moduleUtility.create();
}

/**
 * Edit module task.
 */
function editModule() {
    return moduleUtility.edit();
}

/**
 * Remove module task.
 * To use: `npm run remove-module`
 */
function removeModule() {
    return moduleUtility.remove();
}

/**
 * Inline css task. Inline the css into the html.
 * Contains inlineCss package configuration.
 */
function inlineCssTask() {
    return gulp.src([
            paths.dist + '**/!(_**)/*.html',
            '!dist/components/app-core-styles/*.*'
        ])
        .pipe(inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: true,
            removeLinkTags: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(reloadBrowser({stream: true}))
        .on('error', util.log);
}

/**
 * Seperate mediaqueries task.
 * Gets all mediaqueries and puts them in a seperate file.
 */
function seperateMediaqueriesTask() {
    return gulp.src(paths.distAssets + 'index.css')
        .pipe(gmq({
            use_external: true
        }))
        .pipe(cleanCSS()) // Minify everything.
        .pipe(gulp.dest(paths.distAssets));
}

/**
 * Insert mediaqueries task.
 *
 * Inserts the mediaqueries.css file into the <head>.
 * This task does this for both views and components, so you'll be able to see the mediaqueries
 * work in both view and component previews.
 *
 * Note: This needs to be done AFTER the inlineCssTask() is completed.
 */
function insertMediaqueriesTask() {
    var string = '<!-- inject:css -->';

    return gulp.src([
            paths.dist + '*/!(_**)/*.html',
            '!' + paths.dist + 'components/app-core-styles/*.*'
        ])
        .pipe(replace(string, function () {
            var style = getFileContents('./dist/assets/index.responsive.css');
            return '<style type="text/css">\n' + style + '\n</style>';
        }))
        .pipe(gulp.dest('dist/'));
}

/**
 * Get file contents task. Get the content of a file.
 * @param path
 */
function getFileContents(path) {
    if (fs.existsSync(path)) {
        return fs.readFileSync(path, 'utf8');
    } else {
        return '';
    }
}

/**
 * Highlight code task.
 *
 * Use PrismJS in Node: https://github.com/LeaVerou/prism/pull/179
 * @param {string} code     The code
 * @param {string} lang     The code language
 * @returns {string}        Highlighted code.
 */
function highlightCode(code, lang) {
    if (!code.length) {
        return code;
    }
    code = prism.highlight(code, prism.languages[lang]);
    code = '<pre class="language-' + lang + '"><code>' + code + '</code></pre>';
    return code;
}

/**
 * Get HTML module data task. Returns all HTML module data.
 * @param file
 */
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

/**
 * List directories task. Lists all available directories.
 * @param cwd       paths containing directories.
 */
function listDirectories(cwd) {
    return fs.readdirSync(cwd)
        .filter(function (file) {
            return fs.statSync(cwd + file).isDirectory();
        });
}

/**
 * Parse file-path task.
 * @param filepath      the file-path to parse.
 */
function parsePath(filepath) {
    var extname = path.extname(filepath);
    return {
        dirname: path.dirname(filepath),
        basename: path.basename(filepath, extname),
        extname: extname
    };
}

/**
 * Reload browser task.
 * Uses browserSync for actual reload.
 * @param options
 */
function reloadBrowser(options) {
    // only reload browserSync if active, otherwise causes an error.
    return gulpIf(browserSync.active, browserSync.reload(options));
}

/**
 * Send e-mail task using the emailUtility.
 */
function sendEmailTest() {
    return emailUtility.sendEmail();
}

/**
 * Clean ./dist folder task.
 */
function cleanDistTask() {
    del([paths.dist]);
}

/**
 * Serve task using Browsersync
 * also contains Browsersync settings
 *
 * More info: http://www.browsersync.io/docs/gulp/
 */
function serveTask() {
    browserSync.init(config.browserSync);
}

/**
 * Search for all files with the given file-type.
 * @param filetype      Type of files to search for
 */
function srcFiles(filetype) {
    return gulp.src(paths.srcFiles, {base: paths.src})
        .pipe(filter('**/*.' + filetype));
}

/**
 * Watch tasks
 */
function watchTask () {
    isWatching = true;
    gulp.watch(paths.htmlFiles, function () {
        runSequence('build_scss', 'build_html', 'build_previews', 'build_responsive');
    });
    gulp.watch(paths.scssFiles, function () {
        runSequence('build_scss', 'build_html', 'build_previews', 'build_responsive');
    });
}

/**
 * Zip task
 * Creates a project .zip file in the /dist folder.
 */
function zipDistTask () {
	return gulp.src(paths.dist + '**/*')
		.pipe(zip(pkg.name + '.zip'))
		.pipe(gulp.dest(paths.dist));
}
