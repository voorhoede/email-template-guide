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

	$ npm i && npm i -g gulp

**Build and watch**

	$ npm run develop

**Test with Litmus**

	$ npm run test

**Deploy and pack**

	$ npm run build

##Deliverables

1. [x] Fork Email-guide from Front-end-guide and cleanup repo.
1. [x] Configurate gulp inline-css
1. [x] Configurate gulp litmus
1. [ ] Setup demo email
1. [ ] Nice to have: Pull litmus results and add to a results page.
1. [ ] Nice to have: Make it possible to let inline-css ignore specific styles.

##Documentation

1. [x] How to work with the module manager
1. [ ] Best practices document
	1. [ ] Best practices for gmail
	1. [ ] Best practices for outlook

###Adding and removing modules

Components and views are ***modules***.

You can create or remove modules using a prompt.

	$ npm run add-module

It will ask you:

* If you want to create a ***component*** or a ***view***
* What you want the name of the module to be
* Which types of files you want the module to contain

Executing this command will:

* Create a new directory with the given name in the components or views directory
* Copy the chosen types of files from the `_template` directory into the newly created directory
* Rename the copied files to match the module name (with the exception of `README.md`)
* Fill placeholder inside the copied files with the designated module type and name.

Entering the name of a module that already exists, will add files you choose to the
files that are already in the module. No files will be overridden.
 
To remove modules using a prompt:
	
	$ npm run remove-module

##Contributors

* [João Carmona](https://github.com/jpcarmona) - joao@voorhoede.nl
* [Celine Kurpershoek](https://github.com/celinekurpershoek) - celine@voorhoede.nl
