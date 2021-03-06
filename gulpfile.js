var gulp = require('gulp'),
    gutil = require('gulp-util'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    shell = require('gulp-shell'),
    stylish = require('jshint-stylish');

// SASS compile, autoprefix and minify task
gulp.task('styles', function() {
  return sass('assets/sass/cortana.scss')
    .on('error', gutil.beep)
    .on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(minifycss())
    .pipe(gulp.dest('theme-build/css'));
});

// CSS vendors concat and minify
gulp.task('css_vendors', function() {
  gulp.src([
      'vendors/Slidebars/dist/slidebars.css',
      'vendors/angular-bootstrap/ui-bootstrap-csp.css'
    ])
    .pipe(concat('vendors.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('theme-build/css'))
});

// JS task
gulp.task('scripts', function() {
  gulp.src('assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('theme-build/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('theme-build/js'));
});

// JS vendors concat and minify
gulp.task('js_vendors', function() {
  gulp.src([
      'vendors/jquery/jquery.js',
      'vendors/Slidebars/dist/slidebars.js',
      'vendors/angular/angular.js',
      'vendors/angular-bootstrap/ui-bootstrap.js',
      'vendors/angular-bootstrap/ui-bootstrap-tpls.js',
      'vendors/angular-animate/angular-animate.js',
      'vendors/angular-cookies/angular-cookies.js',
      'vendors/angular-localization/angular-localization.js',
      'vendors/angular-sanitize/angular-sanitize.js',
      'vendors/angular-resource/angular-resource.js',
      'vendors/angular-ui-router/release/angular-ui-router.js',
      'vendors/ngstorage/ngStorage.js',
      'vendors/lodash/dist/lodash.min.js',
      'vendors/moment/moment.js'
    ])
    .pipe(concat('vendors.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('theme-build/js'));
});

gulp.task('browser-sync', function() {
    browserSync.init(['theme-build/css/*.css', '*.html', 'theme-build/js/*.js'], {
      proxy: 'localhost',
      open: false
    });
});

gulp.task('default', ['watch', 'js_vendors', 'css_vendors', 'styles', 'scripts', 'browser-sync']);

gulp.task('watch', function() {
  gulp.watch('assets/sass/*.scss', ['styles']);
  gulp.watch('assets/js/*.js', ['scripts']);
});