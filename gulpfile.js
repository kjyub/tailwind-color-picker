const gulp = require("gulp");

const css = () => {
    const postCSS = require("gulp-postcss");
    const sass = require("gulp-sass")(require("sass"));
    const minify = require("gulp-csso");
    sass.compiler = require("sass");
    return gulp
        .src("assets/scss/styles.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(postCSS([require("tailwindcss"), require("autoprefixer")]))
        .pipe(minify())
        .pipe(gulp.dest("src/"));
};

exports.default = css;