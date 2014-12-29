//==============================================================================
// Dependencies
//==============================================================================

var express   = require('express');
var ViewModel = require('view-models/index');


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
    try {
      res.render('index', model);
    } catch (err) {
      next(err);
    }
  }, function(err) {
    next(err);
  });
});


//==============================================================================
// Export
//==============================================================================

module.exports = router;

