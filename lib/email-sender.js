'use strict';

var nodemailer = require('nodemailer'),
	paths = require('../config.js').paths,
	promptHelper = require('./prompt-helper'),
	chalk = require('chalk'),
	fs = require('fs'),
	Q = require('q');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'email.template.guide@gmail.com',
		pass: 'magicpass'
	}
});

var mailOptions = {
	from: 'Email.Template.Guide <email.template.guide@gmail.com>',
	to: '', // list of receivers
	subject: 'Your template test', // Subject line
	text: 'Email newsletter Test', // plaintext body
	html: ''
};


function listTemplateDirectories(cwd) {
	return fs.readdirSync(cwd)
		.filter(function(file){
			if(file.substr(0, 1) !== '_'){
				return fs.statSync(cwd + file).isDirectory();
			}
		});
}

function getTemplatesIndex() {
	return listTemplateDirectories(paths.srcViews).map(function(name){
			return {
				value: 'views/' + name,
				name: name,
				path: 'views/' + name + '/' + name + '.html'
			};
		});
}

//questions for the type of test to do
var templateChoice = function () {

	return [{
		type: 'checkbox',
		name: 'templateChoice',
		message: 'What template would you like to test?',
		choices: function (){
			return getTemplatesIndex();
		},
		validate: function(templateChoice) {
			if(templateChoice < 1){
				return 'You have to select at least one template';
			}else{
				return true;
			}
		}
	}];
};


//questions for the type of test to do
var testType = function () {
	return [{
		type: 'list',
		name: 'testType',
		message: 'What kind test do you want to do?',
		choices:[{
			name: 'Send template to a specific email',
			value: 'email'
		},{
			name: 'Send template via Litmus',
			value: 'litmus'
		}
		]
	}];
};

//questions for the type of test to do
var targetEmail = function () {
	return [{
		type: 'input',
		name: 'targetEmail',
		message: 'To what email to do want to send the test',
		validate: function(targetEmail) {
			var validEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(targetEmail);
			if(!validEmail){
				return ['Invalid email format for: ', targetEmail].join(' ');
			}else{
				return true;
			}
		}
	}];
};

function selectTemplates() {

	return promptHelper.inquire(templateChoice());
}

function sendTests() {

	return selectTemplates().then(function(templates){

		return promptHelper.inquire(testType()).then(function (answers) {
			if(answers.testType === 'email'){
				return promptHelper.inquire(targetEmail()).then(function(answers){

					if(templates.templateChoice.length === 1){
						mailOptions.to = answers.targetEmail;
						mailOptions.html = getTemplateContent(templates.templateChoice[0]);
						mailOptions.subject = 'Testing - ' + templates.templateChoice[0].substr(6);
						triggerNodemailer(mailOptions);
					}else{
						mailOptions.to = answers.targetEmail;
						//triggerNodemailer(mailOptions);
					}
				});
			}else{

			}
	});

		//else run the litmus test

	});
}

function getTemplateContent(file){
	return fs.readFileSync('dist/' + file+'/'+file.substr(6)+'.html', 'utf-8');
}

function triggerNodemailer(mailOptions){
	return transporter.sendMail(mailOptions, function(error){
		if(error){
			console.log(chalk.bold.red(error));
		}else{
			console.log(chalk.bold.green('Template test sent. Check your inbox.'));
		}
	});
}


module.exports = {
	sendEmail: sendTests
};