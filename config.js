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
		paths.srcViews + '*/assets/**/*.*',
		paths.templates
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

var litmusSelectedApplications = {
		'ol2003' : true,
		'ol2007' : true,
		'ol2010' : true,
		'ol2013' : true,
		'appmail6' : true,
		'outlookcom' : true,
		'yahoo' : true,
		'gmailnew' : true,
		'ffgmailnew' : true,
		'chromegmailnew' : true,
		'android4' : true,
		'androidgmailapp' : true,
		'ipad' : true,
		'ipadmini' :  true,
		'iphone5s' : true,
		'windowsphone8' : true
};

var litmusUserCredentials = {
	username: 'litmus_username',
	password: 'litmus_password',
	url: 'https://yourcompany.litmus.com'
};

var applications = [];

for(apps in litmusSelectedApplications){
	if(litmusSelectedApplications[apps] === true) {
		applications.push(apps);
	}
}

var litmusConfig = litmusUserCredentials;
litmusConfig.applications = applications;

var emailSMTPCredentials = {
	service: 'Gmail',
	auth: {
		user: 'email.template.guide@gmail.com',
		pass: ''
	}
};


module.exports = {
	paths: paths,
	litmusConfig : litmusConfig,
	emailSMTPCredentials : emailSMTPCredentials
};
