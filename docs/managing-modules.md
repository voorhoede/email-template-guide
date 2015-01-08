#Adding and removing modules

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