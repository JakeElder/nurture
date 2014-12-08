var gulp          = require('gulp');
var gutil         = require('gulp-util');
var livereload    = require('gulp-livereload');
var scss          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var bourbon       = require('node-bourbon');
var resetScss     = require('node-reset-scss');
var plumber       = require('gulp-plumber');
var child_process = require('child_process');

var serverProcess;
var scssOptions = {
  includePaths: [resetScss.includePath].concat(bourbon.includePaths)
};
var plumberOptions = {
  errorHandler: scssErrorHandler
};

function scssErrorHandler(err) {
  gutil.beep();
  gutil.log(gutil.colors.black.bgRed(err.message));
}

function startServer() {
  serverProcess = child_process.fork(__dirname + '/bin/www');
  serverProcess.on('message', function(m) {
    if (m.started) {
      gutil.log('Express server started');
      livereload.changed();
    }
  });
}

function restartServer() {
  serverProcess.kill('SIGKILL');
  startServer();
}

function reload(file) {
  return function() {
    if (file) {
      livereload.changed(file);
    } else {
      livereload.changed();
    }
  };
}

gulp.task('server', function() {
  livereload.listen();
  startServer();

  gulp.watch('./client/js/**/*.js', reload('/default.js'));
  gulp.watch('./client/scss/**/*.scss', ['scss']);
  gulp.watch('./public/default.css', reload('/default.css'));
  gulp.watch('./client/jade/**/*.jade', reload());
  gulp.watch('./routes/**/*.js', restartServer);
  gulp.watch('./app.js', restartServer);
});

gulp.task('scss', function() {
  return gulp.src('./client/scss/default.scss')
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(scss(scssOptions))
    .pipe(sourcemaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest('./public/'));
});

gulp.task('default', ['scss', 'server']);

