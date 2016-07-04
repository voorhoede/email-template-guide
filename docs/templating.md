# Templating

The Email Template Guide guide uses Mozilla's [Nunjucks](http://mozilla.github.io/nunjucks/) templating engine for module based development. 

## Template variables

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

* **`pkg`** contains the JSON of [`package.json`](../package.json).


## Template inheritance

A template can [extend](http://mozilla.github.io/nunjucks/templating.html#extends) another template, using `{% extends "path/to/file.ext" %}`. The front-end guide mostly uses extends for views. In the front-end guide all paths are relative to `src/`. For example all views generated using `npm run add-module` extend the base-view: 

	{% extends "views/_base-view/base-view.html" %}


## Template partials

In the Email Template Guide a component HTML is treated as template partials. These partials can be included in other templates using [`include`](http://mozilla.github.io/nunjucks/templating.html#include):

	{# in `src/views/_base-view/base-view.html`: #}
	{% include "components/app-header/app-header.html" %}
