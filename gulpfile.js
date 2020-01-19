const gulp = require('gulp');
const Pug = require('gulp-pug');
const cleanCSS = require('gulp-clean-css'); //壓縮css
const Sass = require('gulp-sass'); //編譯sass/scss檔案
const Concat = require('gulp-concat'); //合併
const Rename = require('gulp-rename'); //重新更名 
const Uglify = require('gulp-uglify'); // 壓縮js
const Babel = require('gulp-babel'); // 壓縮js
const Plumber = require('gulp-plumber'); //處理錯誤訊息
const Postcss = require('gulp-postcss'); //前處理css
const autoprefixer = require('autoprefixer');
const imageMin = require('gulp-imagemin'); //壓縮圖片

/*   HTML   */
gulp.task('Pug', (done) => {
  gulp.src(['./source/view/**/*.pug'])
    .pipe(Plumber())
    .pipe(Pug({
      pretty: true
    }))
    .pipe(gulp.dest('./public'))
  done()
});

/*   CSS   */
gulp.task('Sass', () => {
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

gulp.task('CSSConcat', gulp.series('Sass', () => {
  return gulp.src('./source/stylesheets/css/*.css')
    .pipe(Concat('all.css'))
    .pipe(gulp.dest('./public/stylesheets'))
}));

gulp.task('cleanCSS', gulp.series('CSSConcat', () => {
  return gulp.src('./public/stylesheets/all.css')
    .pipe(Rename(function (path) {
      path.basename += ".min"
      path.extname = ".css"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public/stylesheets'))
}));

/*   JS   */
gulp.task('assets', () => {
  return gulp.src('./source/js/*.js')
    .pipe(gulp.dest('./public/js'))
})

gulp.task('JSConcat', () => {
  return gulp.src('./source/js/app/*.js')
    .pipe(Plumber())
    .pipe(Concat('all.js'))
    .pipe(Babel({
      presets: [
        ['env', {
          modules: false
        }]
      ]
    }))
    .pipe(gulp.dest('./public/js/app'))
});

gulp.task('minifyJS', gulp.series('JSConcat', () => {
  return gulp.src('./public/js/app/*.js')
    .pipe(Plumber())
    .pipe(Uglify(({
      compress: {
        drop_console: true
      }
    })))
    .pipe(Rename(function (path) {
      path.basename += ".min";
      path.extname = ".js";
    }))
    .pipe(gulp.dest('./public/js/app'))
}));

/*   OTHERS   */
gulp.task('imageMin', () => {
  return gulp.src('./source/image/*')
    .pipe(imageMin())
    .pipe(gulp.dest('./public/images'));
});

/*   CMD指令   */
gulp.task('watch', (done) => {
  gulp.watch(['./source/**/*.pug'], gulp.series('Pug'));
  gulp.watch(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'], gulp.series('cleanCSS'));
  gulp.watch('./source/js/**/*.js', gulp.series('minifyJS'));
  done()
});

gulp.task('build', gulp.series('Pug', 'cleanCSS', 'minifyJS', 'imageMin'));

gulp.task('default', gulp.series('Pug', 'cleanCSS', 'assets', 'minifyJS'));