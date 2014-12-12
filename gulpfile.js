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
var svgo          = require('gulp-svgo');
var iconFont      = require('gulp-iconfont');
var consolidate   = require('gulp-consolidate');
var del           = require('del');
var runSequence   = require('run-sequence');
var watch         = require('gulp-watch');
var mocha         = require('gulp-mocha');
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
  if (!file) { return function() { livereload.changed(); }; }
  return function() { livereload.changed(file); };
}

function reloadPublicAsset(e) {
  livereload.changed(e.path.replace(path.join(__dirname, 'public'), ''));
}

gulp.task('server', function() {
  livereload.listen();
  startServer();

  watch('client/js/**/*.js', reload('/default.js'));
  watch('client/scss/**/*.scss', function() { gulp.start('scss'); });
  watch('client/images/ui-elements/*.png', function() { gulp.start('sprites'); });
  watch('client/jade/**/*.jade', reload());
  watch('client/images/vectors/src/*.svg', function() { gulp.start('vectors-font'); });

  watch('public/{images,fonts}/**/*', reloadPublicAsset);
  watch('public/default.css', reloadPublicAsset);

  watch('routes/**/*.js', restartServer);
  watch('app.js', restartServer);
});

gulp.task('scss', function() {
  return gulp.src('client/scss/{default,ui-elements}.scss')
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(scss(scssOptions))
    .pipe(sourcemaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest('public/'));
});

gulp.task('complexity', function() {
  return gulp.src('client/js/**/*.js')
    .pipe(complexity());
});

gulp.task('jshint', function() {
  return gulp.src('{app,lib,config}/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(require('jshint-stylish')));
});

gulp.task('jshint:tests', function() {
  return gulp.src('test/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(require('jshint-stylish')));
});

gulp.task('sprites', function() {
  return gulp.src('client/images/ui-elements/*.png')
    .pipe(sprite({
      prefix: 'ui-element',
      name: 'ui-elements',
      style: '_ui-elements.scss',
      retina: true,
      cssPath: '/images'
    }))
    .pipe(gulpif(
      '*.png',
      gulp.dest('public/images/'),
      gulp.dest('client/scss/modules/')
    ));
});

gulp.task('vectors-font', function(cb) {
  runSequence(
    'vectors-font:clean-optimized-svgs',
    'vectors-font:optimize-svgs',
    'vectors-font:create',
    cb
  );
});

gulp.task('vectors-font:clean-optimized-svgs', function(cb) {
  del('client/images/vectors/optimized/*.svg', cb);
});

gulp.task('vectors-font:optimize-svgs', function() {
  return gulp.src('client/images/vectors/src/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('client/images/vectors/optimized/'));
});

gulp.task('vectors-font:create', function() {
  return gulp.src('client/images/vectors/src/*.svg')
    .pipe(iconFont({ fontName: 'vectors' }))
    .on('codepoints', function(codepoints) {
      gulp.src('lib/gulp/_vector-font.scss')
        .pipe(consolidate('lodash', {
          glyphs: codepoints,
          fontName: 'vectors',
          fontPath: '/fonts/'
        }))
        .pipe(gulp.dest('client/scss/modules/'));
    })
    .pipe(gulp.dest('public/fonts/'));
});

gulp.task('mocha', function() {
  process.env.NODE_ENV = 'test';
  return gulp.src('test/{unit,integration}/**/*.js', { read: false })
    .pipe(mocha());
});

gulp.task('default', function() {
  runSequence(['vectors-font', 'sprites'], 'scss', 'server');
});

