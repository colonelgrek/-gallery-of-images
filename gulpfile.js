"use strict";

const {src, dest} = require("gulp");
const gulp = require("gulp");
const typograf = require('gulp-typograf');
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const del = require("del");
const panini = require("panini");
const browsersync = require("browser-sync").create();

/* Paths */
var path = {
    build: {
        html: "dist/",
        js: "dist/js/",
        css: "dist/css/",
        images: "dist/img/"
    },
    src: {
        html: "src/*.html",
        js: "src/js/*.js",
        css: "src/sass/style.scss",
        images: "src/img/**/*.{jpg,png,svg,gif,ico}"
    },
    watch: {
        html: "src/**/*.html",
        js: "src/js/**/*.js",
        css: "src/sass/**/*.scss",
        images: "src/img/**/*.{jpg,png,svg,gif,ico}"
    },
    clean: "./dist/*/"
}



/* Tasks */
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
}

function html() {
    panini.refresh();
    return src(path.src.html, { base: "src/" })
        .pipe(plumber())
        .pipe(panini({
            root: 'src/',
            layouts: 'src/layouts/',
            partials: 'src/partials/',
            helpers: 'src/helpers/',
            data: 'src/data/'
        }))
        .pipe(typograf({
            locale: ['ru', 'en-US'],
            disableRule: ['common/punctuation/quote']
        }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css, { base: "src/sass/" })
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            Browserslist: ['last 8 versions'],
            cascade: true
        }))
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(removeComments())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js, {base: './src/js/'})
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function images() {
    return src(path.src.images)
        .pipe(imagemin())
        .pipe(dest(path.build.images));
}

function clean() {
    return del(path.clean, '!.dist/readme.md', '!.dist/.git');
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images));
const watch = gulp.parallel(build, watchFiles, browserSync);

/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
