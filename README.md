# Email Template Guide

Build, preview and test your nightmarish email newsletter templates.
Use the Email Template Guide to create your newsletter modules and we take
care of inlining your css on your final template. 

You can also test your layouts on different email clients with [Litmus](http://litmus.com).

## Kick start

**Get a copy**

[Fork](https://github.com/voorhoede/email-template-guide/fork) or
[download](https://github.com/voorhoede/email-template-guide/archive/master.zip) the email-template guide.

**Install all dependencies**

	$ npm install

Now create a `credentials.json` file in the root directory with the following content:

    {
        "AccountUsername" : "<YOUR_LITMUS_USERNAME>",
        "AccountPassword" : "<YOUR_LITMUS_PASSWORD>"
    }

If you have a Litmus account, fill in your credentials. If you don't have a Litmus account, please
create one first.

NOTE: If you leave the fields empty, you will still be able run the project, but you will not enable to
test your templates with Litmus.

**Build and watch**

	$ npm run develop

**Test your templates**

	$ npm run test

**Deploy and pack**

	$ npm run build

## Documentation

* [Managing Modules](docs/managing-modules.md)
* [Templating](docs/templating.md)
* [Testing](docs/testing-your-templates.md)
* [Usefull tips](docs/tips.md)

## Todo && Issues

* [TODO list](docs/todo.md)
* [Issues](https://github.com/voorhoede/email-template-guide/issues)

## Contributors

* [João Carmona](https://github.com/jpsc) - joao@voorhoede.nl
* [Vincent van Dijck](https://github.com/vvandijck) - vincent@voorhoede.nl
* [Celine Kurpershoek](https://github.com/celinekurpershoek) - celine@voorhoede.nl
