var gulp          = require('gulp');
var gulpif        = require('gulp-if');
var gutil         = require('gulp-util');
var livereload    = require('gulp-livereload');
var scss          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var bourbon       = require('node-bourbon');
var resetScss     = require('node-reset-scss');
var plumber       = require('gulp-plumber');
var complexity    = require('gulp-complexity');
var jshint        = require('gulp-jshint');
var sprite        = require('css-sprite').stream;
var path          = require('path');
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

function reloadImage(e) {
  livereload.changed(e.path.replace(path.join(__dirname, 'public'), ''));
}

gulp.task('server', function() {
  livereload.listen();
  startServer();

  gulp.watch('./client/js/**/*.js', reload('/default.js')); gulp.watch('./client/scss/**/*.scss', ['scss']);
  gulp.watch('./client/images/ui-elements/**/*.png', ['sprites']);
  gulp.watch('./client/jade/**/*.jade', reload());

  gulp.watch('./public/images/**/*', reloadImage);
  gulp.watch('./public/default.css', reload('/default.css'));

  gulp.watch('./routes/**/*.js', restartServer);
  gulp.watch('./app.js', restartServer);
});

gulp.task('scss', function() {
  return gulp.src('./client/scss/{default,ui-elements}.scss')
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(scss(scssOptions))
    .pipe(sourcemaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest('./public/'));
});

gulp.task('complexity', function() {
  return gulp.src('./client/js/**/*.js')
    .pipe(complexity());
});

gulp.task('jshint', function() {
  return gulp.src('./client/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(require('jshint-stylish')));
});

gulp.task('sprites', function() {
  return gulp.src('./client/images/ui-elements/**/*.png')
    .pipe(sprite({
      prefix: 'ui-element',
      name: 'ui-elements',
      style: '_ui-elements.scss',
      retina: true,
      cssPath: '/images'
    }))
    .pipe(gulpif(
      '*.png',
      gulp.dest('./public/images/'),
      gulp.dest('./client/scss/modules')
    ));
});

gulp.task('default', ['scss', 'server']);

