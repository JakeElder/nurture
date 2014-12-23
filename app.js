//==============================================================================
// Dependencies
//==============================================================================

// Configure Parse first
var config     = require('config');
var Parse      = require('parse');
Parse.configure(config.PARSE_APP_ID, config.PARSE_REST_API_KEY);

var express     = require('express');
var path        = require('path');
var browserify  = require('browserify-middleware');

var Setting     = require('models/setting');
var disposition = require('disposition');
var querystring = require('querystring');
var routes      = require('routes');


//==============================================================================
// Setup
//==============================================================================

var app = express();

// View engine
app.set('views', path.join(__dirname, 'client/jade'));
app.set('view engine', 'jade');

// Logger
if (app.get('env') === 'development') {
  app.use(require('morgan')('dev'));
}

// Static assets
app.use(express.static(path.join(__dirname, 'public')));
app.get('/default.js', browserify(path.join(__dirname, 'client/js/default.js')));

// Bootstrap routes
require('routes')(app);


//==============================================================================
// Error Handlers
//==============================================================================

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  'use strict';
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'test') {
  app.use(function(err, req, res, next) {
    'use strict';
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler
// No stacktraces leaked to user
app.use(function(err, req, res, next) {
  'use strict';
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//==============================================================================
// Export
//==============================================================================

module.exports = app;

