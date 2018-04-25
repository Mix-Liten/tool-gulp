const gulp = require('gulp');
const Pug = require('gulp-pug');
const cleanCSS = require('gulp-clean-css'); //壓縮css
const Sass = require('gulp-sass'); //編譯sass/scss檔案
const Concat = require('gulp-concat'); //合併
const Rename = require('gulp-rename'); //重新更名 
const Uglify = require('gulp-uglify'); // 壓縮js
const Plumber = require('gulp-plumber'); //處理錯誤訊息
const Postcss = require('gulp-postcss'); //前處理css
const autoprefixer = require('autoprefixer');
const imageMin = require('gulp-imagemin'); //壓縮圖片

/*   HTML   */
gulp.task('Pug', () => {
    return gulp.src(['./source/view/**/*.pug'])
        .pipe(Plumber())
        .pipe(Pug({
            pretty: true
        }))
        .pipe(gulp.dest('./public'))
});

/*   CSS   */
gulp.task('Sass', function () {
    var processors = [
    autoprefixer({
            browsers: ['last 5 version'],
        })
  ];

    return gulp.src(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'])
        .pipe(Plumber())
        .pipe(Sass({
                outputStyle: 'nested'
            })
            .on('error', Sass.logError))
        .pipe(Postcss(processors))
        .pipe(gulp.dest('./source/stylesheets/css'))
});

gulp.task('CSSConcat', ['Sass'], function () {
    return gulp.src('./source/stylesheets/css/*.css')
        .pipe(Concat('all.css'))
        .pipe(gulp.dest('./public/stylesheets'))
});

gulp.task('cleanCSS', ['CSSConcat'], function () {
    return gulp.src('./public/stylesheets/all.css')
        .pipe(Rename(function (path) {
            path.basename += ".min"
            path.extname = ".css"
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./public/stylesheets'))
});

/*   JS   */
gulp.task('JSConcat', function () {
    return gulp.src('./source/js/**/*.js')
        .pipe(Concat('all.js'))
        .pipe(gulp.dest('./public/js'))
});

gulp.task('minifyJS', ['JSConcat'], function () {
    return gulp.src('./public/js/all.js')
        .pipe(Uglify())
        .pipe(Rename(function (path) {
            path.basename += ".min";
            path.extname = ".js";
        }))
        .pipe(gulp.dest('./public/js'))
});

/*   OTHERS   */
gulp.task('imageMin', function () {
    gulp.src('./source/image/*')
        .pipe(imageMin())
        .pipe(gulp.dest('./public/images'));
});

/*   CMD指令   */
gulp.task('watch', function () {
    gulp.watch(['./source/**/*.pug'], ['pug']);
    gulp.watch('source/sass/*.sass', ['cleanCSS']);
    gulp.watch('source/js/*.js', ['minifyJS']);
});

gulp.task('build', ['Pug', 'cleanCSS', 'minifyJS', 'imageMin']);

gulp.task('default', ['Pug', 'cleanCSS', 'minifyJS']);
