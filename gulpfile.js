const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const sassLint = require("gulp-sass-lint");
const concat = require("gulp-concat");
const eslint = require("gulp-eslint");
const watch = require("gulp-watch");
const lintRulesPath = "./.eslintrc";
const autoprefixer = require("gulp-autoprefixer");
const minifyCSS = require("gulp-clean-css");
const minifyJS = require("gulp-uglify");
const fs = require("fs");
const rp = require("request-promise");
const headerComment = require("gulp-header-comment");
const runSeq = require("run-sequence");
const readlineSync = require("readline-sync");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const gutil = require("gulp-util");
const buffer = require("vinyl-buffer");
const config = require("./config.json");
const rename = require("gulp-rename");
const tap = require("gulp-tap");
const path = require("gulp-path");
const joinPath = require("path.join");


var basePaths = {
  theme: './my-theme/src/',
}
var srcPaths = {
  siteStyles: basePaths.theme + 'src_site_css/',
  siteScripts: basePaths.theme + 'src_site_js/',
  moduleStyles: basePaths.theme + 'src_module_css/',
  moduleScripts: basePaths.theme + 'src_module_js/'
}
var destPaths = {
  modules: basePaths.theme + 'modules/',
  siteStyles: basePaths.theme + 'css/',
  siteScripts: basePaths.theme + 'js/'
}
var srcFiles = {
  siteStyles: srcPaths.siteStyles + "main.scss",
  siteScripts: srcPaths.siteScripts + "main.js"
}


function getFilePath(id) {
  const options = {
    method: "GET",
    uri: `http://api.hubapi.com/content/api/v2/templates/${id}?hapikey=${config.api_key}`
  };
  return rp(options);
}

function getModuleSourceFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(joinPath(dir, file)).isDirectory();
    });
}

gulp.task("sass-lint", () => {
  // console.log(`
  // sass-lint loaded
  // `);
  gulp
    .src(srcFiles.siteStyles)
    .pipe(
      sassLint({
        rules: {
          "no-invalid-hex": 0,
          "mixins-before-declarations": 0,
          "no-transition-all": 0,
          "no-color-keywords": 0,
          "no-color-literals": 0,
          "property-sort-order": 0,
          "no-important": 0,
          "class-name-format": 0,
          "force-element-nesting": 0,
          "no-qualifying-elements": 0,
          "force-pseudo-nesting": 0,
          "force-attribute-nesting": 0,
          "variable-name-format": 0,
          "no-url-domains": 0,
          "no-url-protocols": 0,
          "hex-length": 0,
          "hex-notation": 0,
          "no-css-comments": 0,
          "pseudo-element": 0,
          "empty-line-between-blocks": 0,
          "leading-zero": 0,
          quotes: 0,
          "space-after-comma": 0,
          indentation: 0,
          "nesting-depth": 0,
          "no-trailing-whitespace": 0,
          "space-before-brace": 0,
          "final-newline": 0,
          "single-line-per-selector": 0,
          "no-duplicate-properties": 0,
          "no-vendor-prefixes": 0,
          "brace-style": 0,
          "zero-unit": 0,
          "url-quotes": 0,
          "no-empty-rulesets": 0,
          "no-ids": 0,
          "no-mergeable-selectors": 0
        }
      })
    )
    .pipe(sassLint.format())
    // .pipe(sassLint.failOnError())
});

gulp.task("module-sass-lint", () => {
  console.log(`
  module-sass-lint loaded
  `);
  var folders = getModuleSourceFolders(srcPaths.moduleStyles);
  if (folders.length === 0) return done();
  var tasks = folders.map(function(folder) {
    gulp
      .src(joinPath(srcPaths.moduleStyles, folder, '/**/*.scss'))
      .pipe(
       sassLint({
         rules: {
           "no-invalid-hex": 0,
           "mixins-before-declarations": 0,
           "no-transition-all": 0,
           "no-color-keywords": 0,
           "no-color-literals": 0,
           "property-sort-order": 0,
           "no-important": 0,
           "class-name-format": 0,
           "force-element-nesting": 0,
           "no-qualifying-elements": 0,
           "force-pseudo-nesting": 0,
           "force-attribute-nesting": 0,
           "variable-name-format": 0,
           "no-url-domains": 0,
           "no-url-protocols": 0,
           "hex-length": 0,
           "hex-notation": 0,
           "no-css-comments": 0,
           "pseudo-element": 0,
           "empty-line-between-blocks": 0,
           "leading-zero": 0,
           quotes: 0,
           "space-after-comma": 0,
           indentation: 0,
           "nesting-depth": 0,
           "no-trailing-whitespace": 0,
           "space-before-brace": 0,
           "final-newline": 0,
           "single-line-per-selector": 0,
           "no-duplicate-properties": 0,
           "no-vendor-prefixes": 0,
           "brace-style": 0,
           "zero-unit": 0,
           "url-quotes": 0,
           "no-empty-rulesets": 0,
           "no-ids": 0,
           "no-mergeable-selectors": 0
         }
       })
      )
      .pipe(sassLint.format())
      // .pipe(sassLint.failOnError())
  });
});

gulp.task("es-lint", ["scripts"], () => {
  // console.log(`
  // es-lint loaded
  // `);
  gulp
    .src([srcPaths.siteScripts + "*.js"])
    .pipe(
      eslint({
        rules: {
          "prefer-template": 0,
          "no-undef": 0
        }
      })
    )
    .pipe(eslint.format());
});

gulp.task("module-es-lint", () => {
  console.log(`
  module-es-lint loaded
  `);
   var folders = getModuleSourceFolders(srcPaths.moduleScripts);
   if (folders.length === 0) return done();
   var tasks = folders.map(function(folder) {
     gulp
       .src(joinPath(srcPaths.moduleScripts, folder, '/**/*.js'))
       .pipe(eslint({
         rules: {
           "prefer-template": 0,
           "no-undef": 0
         }
       }))
       .pipe(eslint.format());
   });
});

gulp.task("concat-head", () => {
  // console.log(`
  // concat-head loaded
  // `);
  const main = gulp
    .src(srcFiles.siteStyles)
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(autoprefixer());
  return main
    .pipe(concat("main.css"))
    .pipe(headerComment("THIS FILE WAS AUTOGENERATED PLEASE DO NOT EDIT, RISK OF OVERWRITE"))
    .pipe(gulp.dest("./dist"))
    .pipe(gulp.dest(destPaths.siteStyles))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("module-sass", () => {
  // console.log(`
  // module-sass loaded
  // `);
  var folders = getModuleSourceFolders(srcPaths.moduleStyles);
  if (folders.length === 0) return;
  var tasks = folders.map(function(folder) {
    return gulp
      .src(joinPath(srcPaths.moduleStyles, folder, '*.scss'))
      .pipe(sass())
      .pipe(minifyCSS())
      .pipe(autoprefixer())
      .pipe(headerComment("THIS FILE WAS AUTOGENERATED PLEASE DO NOT EDIT, RISK OF OVERWRITE"))
      .pipe(rename("module.css"))
      .pipe(gulp.dest(destPaths.modules + folder + ".module"))
  });
});

gulp.task("scripts", () => {
  // console.log(`
  // scripts loaded
  // `);
  browserify({ debug: true })
    .transform(babelify)
    .require(srcFiles.siteScripts, { entry: true })
    .bundle()
    .on("error", function(err) {
      console.log(err);
      process.exit(1);
    })
    .pipe(source("main.js"))
    .pipe(buffer())
    .pipe(minifyJS())
    .pipe(headerComment("THIS FILE WAS AUTOGENERATED PLEASE DO NOT EDIT, RISK OF OVERWRITE"))
    .pipe(gulp.dest("./dist"))
    .pipe(gulp.dest(destPaths.siteScripts))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('module-scripts', () => {
  // console.log(`
  // module-scripts loaded
  // `);
   var folders = getModuleSourceFolders(srcPaths.moduleScripts);
   if (folders.length === 0) return;
   var tasks = folders.map(function(folder) {
      return gulp
        .src(joinPath(srcPaths.moduleScripts, folder, '/*.js'))
        .pipe(headerComment("THIS FILE WAS AUTOGENERATED PLEASE DO NOT EDIT, RISK OF OVERWRITE"))
        .pipe(rename('module.js'))
        .pipe(gulp.dest(destPaths.modules + folder + ".module"))
        // modules don't currently use .min., but it's here if they start.
        // .pipe(uglify())
        // .pipe(rename('module.min.js'))
        // .pipe(gulp.dest(destPaths.modules + folder + ".module"));
   });
});

gulp.task("servePage", () => {
  const { css, js } = config.files;
  const jsRewrite = [];
  let showCss = {
    rule: {
      match: /<\/head>/i,
      fn(snippet, match) {
        return snippet + match;
      }
    }
  };

  const jsRegex = new Promise((resolve, reject) => {
    if (js.useLocal) {
      if (js.overWriteLocal) {
        const fileLocation = getFilePath(js.id)
          .then(body => {
            const { path } = JSON.parse(body);
            const regVal = `<script .*${path.replace(
              ".js",
              ""
            )}.*\.js.*><\/script>`;
            const regex = new RegExp(regVal);

            jsRewrite.push({
              match: regex,
              fn(req, res, match) {
                return '<script src="/main.js"></script>';
              }
            });
            resolve();
          })
          .catch(() => resolve());
      } else {
        jsRewrite.push({
          match: /<\/body>/i,
          fn(req, res, match) {
            return `<script src="/main.js"></script>${match}`;
          }
        });
        resolve();
      }
    } else {
      resolve();
    }
  });

  const cssRegex = new Promise((resolve, reject) => {
    if (css.useLocal) {
      console.log("using local");
      if (css.overWriteLocal) {
        console.log("overwriting local");
        const fileLocation = getFilePath(css.id)
          .then(body => {
            const { path } = JSON.parse(body);
            console.log({ path });
            const regVal = `<link.*${path.replace(".css", "")}.*.css.*>`;
            const regex = new RegExp(regVal);
            console.log(regex);

            showCss = {
              rule: {
                match: regex,
                fn(snippet, match) {
                  return `<link rel="stylesheet" type="text/css" href="/main.css"/>${snippet}`;
                }
              }
            };

            resolve();
          })
          .catch(() => resolve());
      } else {
        showCss = {
          rule: {
            match: /<\/head>/i,
            fn(snippet, match) {
              return `<link rel="stylesheet" type="text/css" href="/main.css"/>${snippet}${match}`;
            }
          }
        };
        resolve();
      }
    } else {
      resolve();
    }
  });

  console.log(`
  Please wait while we get your file paths.
  `);

  Promise.all([jsRegex, cssRegex]).then(() => {
    browserSync.init({
      proxy: {
        target: process.env.npm_config_myPage
      },
      serveStatic: ["dist"],
      files: ["dist/**"],
      snippetOptions: showCss,
      rewriteRules: jsRewrite,
      https: true,
      ghostMode: {
        scroll: true
      },
      open: true
    });

    gulp.watch(srcPaths.siteStyles + "**/*.scss", [
      "sass-lint",
      "concat-head",
      browserSync.reload
    ]);
    gulp.watch(srcPaths.moduleStyles + "**/*.scss", [
      "module-sass-lint",
      "module-sass"
    ]);
    gulp.watch(srcPaths.siteScripts + "**/*.js", [
      "es-lint",
      "scripts",
      browserSync.reload
    ]);
    gulp.watch(srcPaths.moduleScripts + "**/*.js", [
      "module-es-lint",
      "module-scripts"
    ]);
  });
});

gulp.task("assets-prompt", () => {
  if (
    readlineSync.keyInYN(
      "Are you sure you want to deploy your files? This will overwrite the files already here. (Y for yes, N for no)"
    )
  ) {
    return true;
  }
  console.log("Ok, not deploying. Please update the config and try and again");
  process.exit(1);
});

gulp.task("design-manager", () => {
  const { api_key, files } = config;

  const file = fs.readFileSync(`${__dirname}/dist/main.js`, "utf8");

  Object.keys(files).forEach(function(file) {
    const thisFile = files[file];
    if (!thisFile.useLocal) return;

    if (!thisFile.id)
      return console.error(
        `Please give your ${file} file an ID in config.json`
      );

    const fileString = fs.readFile(__dirname + thisFile.path, (err, data) => {
      if (err) return console.error(err);

      const source = JSON.stringify({
        source: data.toString()
      });

      const options = {
        method: "PUT",
        uri: `http://api.hubapi.com/content/api/v2/templates/${thisFile.id}?hapikey=${api_key}`,
        headers: {
          "Content-Type": "application/json"
        },
        body: source
      };

      rp(options)
        .then(function(body) {
          const { label, folder_id, path } = JSON.parse(body);
          console.log(`
          File: ${folder_id}
          Label: ${label}
          At: ${path}
          Successfully updated`);
        })
        .catch(function(err) {
          return console.error("Upload Failed:", err);
        });
    });
  });
});

gulp.task("build", ["concat-head", "scripts", "module-sass", "module-scripts"]);
// gulp.task("build", ["concat-head", "module-sass"]);
gulp.task("default", ["build", "servePage"]);
// gulp.task("default", ["build"]);

gulp.task("assets", function() {
  return runSeq("assets-prompt", ["concat-head", "scripts"], "design-manager");
});
