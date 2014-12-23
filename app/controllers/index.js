//==============================================================================
// Dependencies
//==============================================================================

var Q           = require('q');
var express     = require('express');
var ViewModel   = require('view-models/index');


//==============================================================================
// Setup
//==============================================================================

var router = express.Router();


//==============================================================================
// Actions
//==============================================================================

router.get('/', function(req, res, next) {
  'use strict';
  new ViewModel(req.query).ready.then(function(model) {
    res.render('index', model);
  }, function(err) {
    next(err);
  });
});


//==============================================================================
// Export
//==============================================================================

module.exports = router;

