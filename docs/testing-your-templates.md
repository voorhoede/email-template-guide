#Testing your templates

For testing your templates you have two options. You can send your templates to a specific e-mail of your own or simply test on different e-mail clients if you have a [Litmus](http://www.litmus.com) account.

On either option is better that you pass first by the [config](../config.js) file to adapt to your personal settings.

In `litmusConfig.applications` you can define which of the e-mail clients do you want to test via litmus. (be aware that the available clients may vary from one account to another).

In `litmusConfig` you set your Litmus Credentials. For more info about this check your online dashboard at [Litmus](http://www.litmus.com).

In `emailSMTPCredentials` you set your credentials to to send your single email test. This uses nodemailer to send the emails, so for more specific configurations head to [nodemailer on github](https://github.com/andris9/Nodemailer#examples).

When you are ready just type on your command line:

	$ npm run test

You will be asked to choose which templates you want to test and what method (Litmus or specific e-mail address).

If you selected to send your template(s) to a specific e-mail address, you will be asked to choose a valid email to send them to.

If you selected to send your template(s) to Litmus, the templates should be send to the clients you chose and you can check Litmus for the results.

The idea is that in future versions you wouldn't neet to check your account online because all the rendered templates would be saved on your local project as images.