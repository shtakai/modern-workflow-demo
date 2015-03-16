'use strict';

var browserify = require('browserify'),
    gulp       = require('gulp'),
    run        = require('gulp-run'),
    transform  = require('vinyl-transform'),
    uglify     = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    ts         = require('gulp-typescript'),
    tslint     = require('gulp-tslint'),
    sass       = require('gulp-sass'),
    scsslint   = require('gulp-scss-lint'),
    minifyCSS  = require('gulp-minify-css'),
    del        = require('del'),
    browserSync = require('browser-sync');

var paths = {
  ts : './source/ts/**/**.ts',
  jsDest : './temp/js/',
  dtsDest : './temp/definitions/',
  scss : './source/scss/**/**.scss',
  scssDest : './temp/css/',
  jsEntryPoint : './temp/js/main.js',
  bowerComponents : './bower_components',
  nodeModules : 'node_modules',
  temp : './temp',
  dist : './dist/'
};

var tsProject = ts.createProject({
    removeComments : true,
    noImplicitAny : true,
    target : 'ES3',
    module : 'commonjs',
    declarationFiles : true
});

// Download third party components

gulp.task('bower', function() {
  run('bower install').exec();
});

gulp.task('npm', function() {
  run('npm install').exec();
});

gulp.task('tsd', function() {
  run('tsd reinstall -so').exec();
});

// Build typescript

gulp.task('ts-lint', function(){
  gulp.src(paths.ts)
      .pipe(tslint())
      .pipe(tslint.report('verbose'));
});

gulp.task('tsc', function(){
  var tsResult = gulp.src(paths.ts).pipe(ts(tsProject));
  tsResult.dts.pipe(gulp.dest(paths.dtsDest));
  tsResult.js.pipe(gulp.dest(paths.jsDest));
});

// Build scss

gulp.task('scss-lint', function() {
  gulp.src(paths.scss)
      .pipe(scsslint());
});

gulp.task('scss', function () {
    gulp.src(paths.scss)
        .pipe(sass())
        .pipe(gulp.dest(paths.scssDest));
});

gulp.task('minify-css', function() {
  return gulp.src(paths.scssDest + '*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.dist))
});

// Browserify, uglify and sourcemaps

gulp.task('minify-js', function () {
  // transform regular node stream to gulp (buffered vinyl) stream
  var browserified = transform(function(filename) {
    var b = browserify({ entries: filename, debug: true });
    return b.bundle();
  });

  return gulp.src(paths.jsEntryPoint)
    .pipe(browserified)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist));
});

// Karma (mocha, chai, sinon)

// todo

// Browser-sync

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("dist/*.js", [browserSync.reload]);
    gulp.watch("dist/*.css", [browserSync.reload]);
    gulp.watch("*.html", [browserSync.reload]);
});

// Clean

gulp.task('clean', function (cb) {
  del([paths.temp], cb);
});

gulp.task('build-ts', ['ts-lint','tsc']);
gulp.task('build-scss', ['scss-lint','scss']);
gulp.task('bundle-js', ['build-ts', 'minify-js']);
gulp.task('bundle-css', ['build-scss', 'minify-css']);

gulp.task('install', ['bower','npm', 'tsd']);
gulp.task('build', ['build-ts','build-scss']);
gulp.task('optimize', ['bundle-js','bundle-css']);
gulp.task('test', ['karma']);
gulp.task('sync', ['browser-sync']);

// Default task
gulp.task('default', ['build', 'optimize', 'test', 'sync', 'clean']);
