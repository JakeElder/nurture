//==============================================================================
// Dependencies
//==============================================================================

var express    = require('express');
var path       = require('path');
var browserify = require('browserify-middleware');
var routes     = require('./config/routes');


//==============================================================================
// Setup
//==============================================================================

var app = express();

// View engine
app.set('views', path.join(__dirname, 'client/jade'));
app.set('view engine', 'jade');

// Logger
app.use(require('morgan')('dev'));

// Static assets
app.use(express.static(path.join(__dirname, 'public')));
app.get('/default.js', browserify(path.join(__dirname, 'client/js/default.js')));

// Bootstrap routes
require('./config/routes')(app);


//==============================================================================
// Error Handlers
//==============================================================================

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
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

