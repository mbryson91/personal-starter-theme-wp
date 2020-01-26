var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var log = require('fancy-log');
var colors = require('ansi-colors');
var clean = require('gulp-clean-css');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
//project variables
var url = 'https://newsite.test', //the url of your local build, for BrowserSync
    dist = 'dist',
    production = argv.production,
    development = !argv.production,
    enableBS = false; //manually disbale BrowserSync if its acting up

if(argv.production) {
  enableBS = false;
}


gulp.task('sass', function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(gulpif(development,sourcemaps.init()))
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .on('error', sass.logError)
    .pipe(autoprefixer())
    .pipe(clean({debug: true, compatibility: 'ie8'}, (details) => {
      console.log(colors.bold(colors.green(`Optimised: ${details.name}: from ${(details.stats.originalSize / 1024).toFixed(2)}kb to ${(details.stats.minifiedSize / 1024).toFixed(2)}kb. Time taken: ${(details.stats.timeSpent)}`)));
    }))
    .pipe(gulpif(development,sourcemaps.write(".")))
    .pipe(gulp.dest('dist/css'))
    .pipe(gulpif(enableBS,browserSync.reload({
      stream: true
    })))
});


gulp.task('js', function () {
  return gulp.src(['node_modules/babel-polyfill/dist/polyfill.js','src/js/*.js'])
    //.pipe(plumber())
    .pipe(gulpif(development,sourcemaps.init()))
    .pipe(babel())
    .pipe(gulpif(production,uglify()))
    .pipe(gulpif(development,sourcemaps.write(".")))
    .pipe(gulp.dest('dist/js'))
    .pipe(gulpif(enableBS,browserSync.reload({
      stream: true
    })))
});

gulp.task('images', function () {
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function () {
  return del.sync('dist');
});

gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback)
});

gulp.task('browserSync', function () {
  if(enableBS) {
    browserSync.init({
      proxy: url,
      ui: {
        port: 8080
      },
    })
  };
});


gulp.task('watch', function () {
  // gulp.series('browserSync', 'sass');
  gulp.watch('src/scss/**/*.scss', gulp.parallel('sass'))
    .on('change', path => log('File ' + colors.bold(colors.magenta(path)) + ' changed.'))
    .on('unlink', path => log('File ' + colors.bold(colors.magenta(path)) + ' was removed.'));
  gulp.watch('**/*.php', gulp.series(browserSync.reload))
    .on('change', path => log('File ' + colors.bold(colors.magenta(path)) + ' changed.'))
    .on('unlink', path => log('File ' + colors.bold(colors.magenta(path)) + ' was removed.'));
  gulp.watch('src/js/**/*.js', gulp.series('js'))
    .on('change', path => log('File ' + colors.bold(colors.magenta(path)) + ' changed.'))
    .on('unlink', path => log('File ' + colors.bold(colors.magenta(path)) + ' was removed.'));

});


//dont need to watch, to just run the tasks
gulp.task('build',
  gulp.parallel('clean','sass', 'images', 'fonts',  function (callback) {callback})
)


//run the clean, build the sass, start the browsersync, then watch for changes.
gulp.task('default', 
  gulp.parallel('clean','sass','js','browserSync','images', 'fonts','watch',function(callback){callback})
)