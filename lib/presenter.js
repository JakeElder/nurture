//==============================================================================
// Dependencies
//==============================================================================

var _ = require('lodash');


//==============================================================================
// Presenter definition
//==============================================================================

var Presenter = function(model) {
  'use strict';

  // Store reference to model
  this._model = model;

  // Make reference to `this` available
  var presenter = this;

  // Get an array of properties that should be delegated to the model
  var properties = Object.keys(model._properties).filter(function(key) {
    return !(key in presenter);
  });

  // Delegate untouched properties to the model
  _.each(properties, function(key) {
    Object.defineProperty(presenter, key, {
      enumerable: true,
      get: function() { return model[key]; }
    });
  });
};


//==============================================================================
// Export
//==============================================================================

module.exports = Presenter;

