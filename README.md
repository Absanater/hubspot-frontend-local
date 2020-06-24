# Hubspot local development
This project was designed to help developers worry **less** about coding css and javascript and testing on hubspot and focus **more** on the stuff we enjoy! **Development!**

This project includes:

 - Hot reload of site CSS and JS on external pages (hubspot) on localhost using browsersync
 - Sass compiler / linter
 - JS compiler / linter
 - Simple replacement of main css and js files in design manager with your own local files
 - Theme sub-repository to house and watch your entire theme
 - Sass compiler / linter
 - Custom module Sass compiler / linter
 - Custom module JS compiler / linter
 - Watch site and module CSS / JS to deploy to design manager immediately
 - Bootstrap and font awesome as optional imports
 
This application has two sides: 
 + a site CSS/JS taskrunner that compiles your code, hot-reloads a preview page via browsersync, and can deploy your main css and js files to the design manager; and
 + the option to add a theme sub-module, allowing you to use Sass, linting, and compiling with any or all of your custom modules as well as the theme's main CSS and JS files, and deploy them to the theme in the design manager.

This isn't meant for working on every piece of the site at once. The browsersync doesn't work with modules yet, so, while module files can compile and push to production, they still need a separate watch function and a manual refresh of the sample page.


## Getting Set Up
To get started first we need to checkout this project and run
  	
	git@github.com:dreigenannt/hubspot-frontend-local.git
    npm install

Also, if you will be using a theme, install the HubSpot Local Development Tools if needed (instructions on the internet). Then, initialize HubSpot Local Dev in the root of the project, and connect with your Personal Access Key.

	npx hs init
	
This will allow you to watch theme and module CSS and JS, and send them back to the design manager for real-time updates.






## BrowserSync and Basic Site CSS / JS Compilation (No Theme)
### Configuration

First, remove the two module references from the build task in the gulpfile, since they will not run without a theme.

Next we need to decide what we are going to be using the site CSS / JS application for. There is Development on local, deployment to HubSpot file manager, or both. In the main directory there should be a file called **config.json**

    {
       "api_key": "YOUR_API_KEY",
          "files": {
             "css": {
                "path": "/dist/main.css",
                "useLocal": true,
                "overWriteLocal": true,
                "id": [id number of main.css in the design manager]
             },
             "js": {
                "path": "/dist/main.js",
                "useLocal": true,
                "overWriteLocal": true,
                "id": [id number of main.js in the design manager]
             }
       }
    }


Key|Description
---|---
api_key |This is the hubspot api key you need to fill in for the deployments to go to the correct place
path|This is the path to the local files for js and css. If you arent editing the source of this project these values will probably not change.
useLocal|This includes the css and js on the localhost pages if set to true. If for example you are working on css and not JS you would set js useLocal to false.
overWriteLocal|If this is set to true localhost will use **file_directory** and **rename** (if set) and replace the link to the file on hubspot with your own. e.g `<script type="text/javascript" src="https://cdn2.hubspot.net/hubfs/308496/hubspot-dev/main.js"></script>` will become `<script type="text/javascript" src="/main.js"></script>` and be using your local file instead. The same applies with CSS. **The file has to exist on the page or nothing will show. If the file does not exist set to false.** 
id|This in the id of the css or js file in hubspot. First of all if you are selecting a existing file within design manager navigate to this file. Otherwise create a new file in your desired path. In the image below you can find the ID for the given file at the end of its url within file manager. e.g 6023636249.


![File id found in url of CSS](https://drive.google.com/file/d/1C2-J1RozSJP2sZc8XE7yMqGeTuz0WU1Y/view?usp=sharing)


After the config has been set up we are ready to start using the browsersync!


### Displaying a Sample Page with Site CSS and JS using BrowserSync
To start running the code all we need now is the preview link to the page we are going to edit within hubspot e.g "https://my.hspage.com/my-page?hs_preview=eQsNmhHz-5934786515"

And now the following should be entered into your terminal at the folder:

    npm start --myPage="https://my.hspage.com/my-page?hs_preview=eQsNmhHz-5934786515&hsDebug=true"
    
That should then popup a window from your page in your browser. The hs_preview parameter is not required. Using the hsDebug parameter is recommended; it forces the browser to reject the HS-compiled "combined.css" stylesheet that often overrides local changes.

The SASS and JS can be found inside

 - src/scripts
 - src/styles

When writing JS you can create new files other than main.js and do your work. Whenever a JS file is saved OR sass file the site should reload on the page with your changes being picked up. Linting should show up when changes are made and can be edited in eslintrc file or in the gulpfile for the javascript although its recommended to stick to what is there for use and readability!


### Deployment of Site CSS and JS Files (if not using a theme)

To deploy to filemanager ensure the directory is where you want the files to go in hubspot inside of config.json then run:

    npm run deploy
This will then give a promp asking to continue. Y for yes will then finish the deploy and that is it.

Your file should now be in hubspot.

 




## Using a Theme
Using a theme is not required. If you choose to use one, though, you can run `hs watch` inside the theme to auto-deploy site or module CSS and JS to the theme directory in the design manager.

### Setup
First, include your theme repository. You can do this in one of two ways:

1. If you plan to source-code control your theme separately for distribution, add it as a git submodule. For example, to start with the HubSpot Boilerplate theme, run `git submodule add git@github.com:HubSpot/cms-theme-boilerplate.git <dest>`

1. If you don't plan to source-code control your theme separately, add it into the project. You can use a HubSpot command like `hs create website-theme <dest>`, or download a theme package and move it into the project.

You will now be able to run `hs watch` on directories inside the theme to deploy changes to the design manager in real time, or `hs upload` to deploy them later.

Then, configure and set up the browsersync as above, but leaving the module references in the build task intact and ignoring the deploy process.

Finally, edit the gulpfile and point `basePaths.theme` to the root of your theme directory.




### Site CSS and JS

**Many pre-packaged themes keep SCSS and JS source files in the same directory as the compiled files. It is recommended to store source and destination in different directories.** If needed, create separate source directories and move your SASS and JS source files there, leaving the compiled file in the original directory. Source directories can be at any level of the project; however, if you plan to package the theme for distribution, they should be within the theme.

Configuring the browsersync above compiles CSS and JS for the display only. Edit the gulpfile and point `srcPaths` and `destPaths` for `siteStyles` and `siteScripts` to your respective source and destination directories for SASS and JS and `srcFiles` for scripts to the main script source file.

Now, the compiler will pipe to the browsersync _and_ to your theme.





### Module CSS and JS

As with CSS and JS, it is recommended to store source and destination in different directories. Create source directories for your module SASS and JS. Then, update the gulpfile to point `srcPaths` for `moduleStyles` and `moduleScripts` to your source directories for SASS and JS, and `destPath` for `modules` to the directory that houses your modules.

The module CSS and JS compilation relies on an exact match of directory names for both source and destination. For example:
	
Source|Compiles to
---|---
/my-theme/module\_styles/**my-module**/\_style.scss|my-theme/modules/**my-module**/style.css

Create a directory for each module you wish to compile. Inside the directory can be multiple source files. You are not required to include all modules in the application; the task will compile what's in the src and leave other modules alone.





### Viewing Module Changes
Initializing the browsersync will compile and watch the module sass / scripts, but **themes and modules are not reflected in the browsersync itself at this time.** Changes to a module will not be visible via the live reload. Choose one of the deploy options below to see module updates in real time.


### Deploying Changes Within Themes
If your site or module code is not on live pages (i.e., the site is under development), or if you're comfortable with changes going live immediately, you can run `npx hs watch` to sync the theme or on a subdirectory or module itself. `hs watch` will respond whenever the browsersync application pipes new code to the theme.

Once code is written to the design manager, you can manually refresh the page in the browser, and see the module code updates.

Again, local main CSS / JS local code is visible in the browsersync but local module code is not. If a module is on live pages,  it's fairly easy to duplicate a module, put that module on a test page, and run that page in the browsersync with `hs watch` and manual refresh of the page to test changes before transferring the finished code to the live module.





## Current Issues
 - Some people have had problems with caching/updating times with files within HubSpot


## Future Ideas
Feel free to contribute and improve this project. Hoping in the future we can have:

 - Deployments of templates
 - Editing of html pages
 - Multiple CSS / JS files
 
 
## Contributors
This project is an extension of https://github.com/Absanater/hubspot-frontend-local

Big thanks to everyone who has made contributions to the project.
 
[Daniel Ord](https://github.com/danord24)
