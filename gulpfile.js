const gulp = require("gulp");
const del = require("del");
const batch = require('gulp-batch');
const typescript = require("gulp-typescript");
const tsProject = typescript.createProject("tsconfig.json");
const npmDependencies = require("gulp-npm-files");
const runSequence = require('run-sequence');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const tslint = require("gulp-tslint")
const sourcemaps = require('gulp-sourcemaps');
const path = require("path");
const url = require("url");
const fs = require("fs");
const karma = require('karma').Server;
const glob = require("glob");

const outDir = "www";

const defaultFile = "index.html"
const folder = path.resolve(__dirname, outDir);

// clean the contents of the distribution directory
gulp.task("clean", () => {
    return del(outDir.concat("/**/*"), { force: "true" });
});

gulp.task("generate-kui-module", () => {
    let components = {};
    glob("app/kui/components/**/*.component.ts", (err, files) => {
        files.forEach(file => {
            
        });
    });
})

// TypeScript compile
gulp.task("compile", () => {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(outDir));
});

// copy non-dev dependencies to the output
gulp.task("copy-node-dependencies", () => {
    return gulp.src(npmDependencies(), { base: './' }).pipe(gulp.dest(outDir));
});

gulp.task("copy-assets", () => {
    var assets = ["src/**/*.html", "src/**/*.js", "src/**/*.css"]
    return gulp.src(assets).pipe(gulp.dest(outDir));
});

gulp.task("copy-configurations", () => {
    var configs = ["src/**/*.json"];
    return gulp.src(configs).pipe(gulp.dest(outDir));
});

gulp.task("sass", () => {
    return gulp.src('src/**/*.scss')
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(outDir));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task("reload", ["build-no-clean"], (done) => {
    browserSync.reload();
    done();
});

gulp.task("do-watch", () => {
    browserSync.init({
        open: false,
        server: {
            baseDir: outDir,
            routes: {
                "/node_modules": outDir + "/node_modules"
            },
            middleware: function (req, res, next) {
                var fileName = url.parse(req.url);
                fileName = fileName.href.split(fileName.search).join("");
                var fileExists = fs.existsSync(folder + fileName);
                if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
                    req.url = "/" + defaultFile;
                }
                return next();
            }
        }
    });

    gulp.watch("src/**/*", ["reload"]);
});

gulp.task("watch", ["build"], () => {
    gulp.start("do-watch")
});

gulp.task("build", (cb) => {
    runSequence("clean",
        ["copy-node-dependencies", "build-no-clean"],
        cb);
});

gulp.task("build-no-clean", ["copy-assets", "copy-configurations", "sass", "compile"])

gulp.task("default", ["build"]);

gulp.task("tslint", () =>
    gulp.src("src/**/*.ts")
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
);

gulp.task("test", done => {
    new karma({
        configFile: __dirname + '/karma.conf.js'
        //    singleRun: true
    }, done).start();
});