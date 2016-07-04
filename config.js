'use strict';

/**
 * Paths configuration.
 */
var paths = {
    src: 'src/',
    srcComponents: 'src/components/',
    srcVendor: 'src/vendor/',
    srcViews: 'src/views/',
    dist: 'dist/',
    distAssets: 'dist/assets/',
    distComponents: 'dist/components/',
    distViews: 'dist/views/'
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

paths.htmlFiles = paths.srcFiles.map(function (path) {
    return path + '.html';
});

paths.scssFiles = paths.srcFiles.map(function (path) {
    return path + '*/*.scss';
});

/**
 * Browserify configuration.
 * @type {{server: {baseDir: string}, ui: boolean, online: boolean, open: boolean}}
 */
var browserDefaultConfig = {
    files: [
        'dist/assets/index.css',
        'dist/**/*.html',
        'dist/assets/*.js'
    ],
    logFileChanges: false,
    notify: false,
    online: false,
    open: false,
    port: 3000,
    server: {
        baseDir: paths.dist
    },
    ui: false
};

/**
 * Litmus configuration.
 *
 * To get the codes:
 * https://yourcompany.litmus.com/emails/clients.xml
 *
 * NOTE: Make sure that the number of clients in 'applications' is the same as in your
 * Litmus settings.
 */
var litmusConfig = {
    username: 'litmus_username',
    password: 'litmus_password',
    url: 'https://yourcompany.litmus.com',
    applications: [
        'ol2000',
        'ol2002',
        'ol2003',
        'ol2007',
        'ol2010',
        'ol2011',
        'ol2013',
        'ol2015',
        'ol2016'
    ]
};

var emailSMTPCredentials = {
    service: 'Gmail',
    auth: {
        user: 'youremail@gmail.com',
        pass: 'password'
    }
};

module.exports = {
    paths: paths,
    litmusConfig: litmusConfig,
    emailSMTPCredentials: emailSMTPCredentials,
    browserSync: browserDefaultConfig
};
