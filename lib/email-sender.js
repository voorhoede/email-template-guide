'use strict';

var nodemailer = require('nodemailer'),
	promptHelper = require('./prompt-helper'),
	chalk = require('chalk'),
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
	text: 'Hello world ✔', // plaintext body
	html: '<b>Hello world ✔</b>' // html body
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
		}]
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


function sendEmail() {
	return promptHelper.inquire(testType()).then(function (answers) {
		if(answers.testType === 'email'){
			return promptHelper.inquire(targetEmail()).then(function(answers){
				mailOptions.to = answers.targetEmail;
				triggerNodemailer(mailOptions);
			});
		}
		//else run the litmus test

	});
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
	sendEmail: sendEmail
};