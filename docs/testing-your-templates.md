#Testing your templates

For testing your templates you have two options. You can send your templates to a specific email of your own or simply test on different email clients if you have a [Litmus](http://www.litmus.com) account.

On either option is better that you pass first by the [config](../config.js) file to adapt to your personal settings.

On `litmusSelectedApplications` you can define which of the email clients do you want to test via litmus. (be awared that the available ones may differ from account to another).

On `litmusUserCredentials` you set your Litmus Credentials. For more info about this check your online dashboard at [Litmus](http://www.litmus.com).

On `emailSMTPCredentials` you set your credentials to to send your single email test. This uses nodemailer to send the emails, so for more specific configurations head to [nodemailer on github](https://github.com/andris9/Nodemailer#examples).

When you are ready just type on your command line:

	$ npm test
	
You will be asked to choose which templates you want to test and what method.

If you select template(s) to a specific email you will be asked to choose a valid email to send them (the templates to).

If you select to send your templates via Litmus, the templates should be send accordingly to the ones you choose and you can just check on your Litmus account for the results.

The idea is that in future versions you wouldn't neet to check your account online because all the rendered templates would be saved on your local project as images.