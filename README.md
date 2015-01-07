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
1. [x] Templating with Nunjucks
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

### Templating

The Email Template Guide guide uses Mozilla's [Nunjucks](http://mozilla.github.io/nunjucks/) templating engine for module based development. 

#### Template variables

The Email Template Guide comes packed with a set of [variables](http://mozilla.github.io/nunjucks/templating.html#variables) which you can use in the templates using variable expressions `{{ var }}`:
	
* **`module`** is available in the context of a module, for example in `views/home/home.html` and has the following properties:
	* `type` - module type ("component" or "view")
	* `name` - module directory name, eg. `home`.
	* `html` - module HTML as string.
	
* **`moduleIndex`** is a list of all modules grouped by module type.
	* `moduleIndex.components` is a list of all components. 
	* `moduleIndex.views` is a list of all views. 
	* Each module (eg. `moduleIndex.components[0]`) has the following properties: 
		* `type` - module type ("component" or "view")
		* `name` - module directory name, eg. `app-header`.
		* `id` - unique slug based on module type directory plus module name, eg. `components/app-header`.
		* `path` - path to module's index.html file relative to web root.

* **`paths.root`** resolves to the relative web path to the `dist/` directory. Usage:

	```html
		<a href="{{ path.root }}views/_style-guide/style-guide.html">...</a>
	```

* **`paths.assets`** resolves to the relative web path to the `dist/assets/` directory. Usage:

	```html
		<img src="{{ paths.assets }}components/app-logo/demo-logo.svg" alt="demo">
	```
			
* **`pkg`** contains the JSON of [`package.json`](package.json).


#### Template inheritance

A template can [extend](http://mozilla.github.io/nunjucks/templating.html#extends) another template, using `{% extends "path/to/file.ext" %}`. The front-end guide mostly uses extends for views. In the front-end guide all paths are relative to `src/`. For example all views generated using `npm run add-module` extend the base-view: 

	{% extends "views/_base-view/base-view.html" %}
	

#### Template partials

In the Email Template Guide a component HTML is treated as template partials. These partials can be included in other templates using [`include`](http://mozilla.github.io/nunjucks/templating.html#include):

	{# in `src/views/_base-view/base-view.html`: #}
	{% include "components/app-header/app-header.html" %}

###Testing with Litmus

If you have a Litmus account you are going to love this option. (If not you can still try for 8 days)

Just edit the [config](config.js) file with your personal information and then run:

	$ npm run test

Now visit your Litmus account to check your email newsletter outputs on diferent email clients.

 
##Contributors

* [João Carmona](https://github.com/jpcarmona) - joao@voorhoede.nl
* [Celine Kurpershoek](https://github.com/celinekurpershoek) - celine@voorhoede.nl
