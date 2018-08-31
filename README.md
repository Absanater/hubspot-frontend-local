
# Hubspot local development
This project was designed to help developers worry **less** about coding css and javascript and testing on hubspot and focus **more** on the stuff we enjoy! **Development!**

This project includes:

 - Hot reload on external pages (hubspot) on localhost using browsersync
 - Replacement of hubspot css and js files with your own local files
 - Sass compiler / linter
 - JS Compiler / linter
 - Bootstrap and font awesome as optional imports
 - Deployment to hubspot design manager

## Getting setup
To get started first we need to checkout this project and run

    npm install

Next we need to decide what we are going to be using the application for. There is Development on local, deployment to hubspot file manager or both. In the main directory there should be a file called **config.json**

    {
       "api_key": "YOUR_API_KEY",
          "files": {
             "css": {
                "path": "/dist/main.css",
                "useLocal": true,
                "overWriteLocal": true,
                "id": 6023636249
             },
             "js": {
                "path": "/dist/main.js",
                "useLocal": true,
                "overWriteLocal": true,
                "id": 6021351972
             }
       }
    }

|Key|Description  |
|--|--|
| api_key |This is the hubspot api key you need to fill in for the deployments to go to the correct place|
|path|This is the path to the local files for js and css. If you arent editing the source of this project these values will probably not change|
|useLocal|This includes the css and js on the localhost pages if set to true. If for example you are working on css and not JS you would set js useLocal to false.|
|overWriteLocal|If this is set to true localhost will use **file_directory** and **rename** (if set) and replace the link to the file on hubspot with your own. e.g `<script type="text/javascript" src="https://cdn2.hubspot.net/hubfs/308496/hubspot-dev/main.js"></script>` will become `<script type="text/javascript" src="/main.js"></script>` and be using your local file instead. The same applies with CSS. **The file has to exist on the page or nothing will show. If the file does not exist set to false.** |
|id|This in the id of the css or js file in hubspot. First of all if you are selecting a existing file within design manager navigate to this file. Otherwise create a new file in your desired path. In the image below you can find the ID for the given file at the end of its url within file manager. e.g 6023636249.

![File id found in url of CSS](https://lh3.googleusercontent.com/h9Ky1gW9IqrEjU6snJkpJAy1Z3MrbOulQxCXpqxH3fY8XMVE75H_Vnp5WK8RVsA93CGflZKYlDo "file id")


After the config has been set up we are ready to start using the application!

## Running
To start running the code all we need now is the preview link to the page we are going to edit within hubspot e.g "https://my.hspage.com/my-page?hs_preview=eQsNmhHz-5934786515"

And now the following should be entered into your terminal at the folder:

    npm start --myPage=https://my.hspage.com/my-page?hs_preview=eQsNmhHz-5934786515
That should then popup a window from your page in your browser. The SASS and JS can be found inside

 - src/scripts
 - src/styles

When writing JS you can create new files other than main.js and do your work. Whenever a JS file is saved OR sass file the site should reload on the page with your changes being picked up. Linting should show up when changes are made and can be edited in eslintrc file or in the gulpfile for the javascript although its recommended to stick to what is there for use and readability!
## Deployment

To deploy to filemanager ensure the directory is where you want the files to go in hubspot inside of config.json then run:

    npm run deploy
This will then give a promp asking to continue. Y for yes will then finish the deploy and that is it.

Your file should now be in hubspot.
  ## Current Issues
 - If CSS is used as combined-css within hubspot overwrite local will not be able to detact its path and replace with the local css file in development.
 - Some people have had problems with caching/updating times with files within hubspot


## Future Ideas
Feel free to contribute and improve this project. Hoping in the future we can have:

 - Deployments of templates
 - Editing of html pages and modules
 - Multiple CSS / JS files
 - Workaround for "combined.css"
