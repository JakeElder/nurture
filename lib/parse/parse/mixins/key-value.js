//==============================================================================
// Dependencies
//==============================================================================

var Q      = require('q');
var _      = require('lodash');
var marked = require('marked');


//==============================================================================
// Define mixin factory
//==============================================================================

var KeyValueFactory = function(o) {
  'use strict';
  o = o || {};
  o.markdownKeys = o.markdownKeys || [];
  return {
    classMethods: getClassMethods(o)
  };
};


//==============================================================================
// Class methods
//==============================================================================

var getClassMethods = function(o) {
  'use strict';
  return {
    getHash: function() {
      var deferred = Q.defer();
      // Get an array of models
      this.all().then(function(models) {
        var hash = {};
        // Loop through each of the models
        _.each(models, function(model) {
          // Get the value
          var value = model.value;
          // If the current key was specified in options.markdownKeys,
          // pass it through the marked function
          if (o.markdownKeys.indexOf(model.key) !== -1) {
            value = marked(value);
          }
          // Add value to hash
          hash[model.key] = model.value;
        });
        // Resolve deferred with populated hash
        deferred.resolve(hash);
      });
      return deferred.promise;
    }
  };
};


//==============================================================================
// Export
//==============================================================================

module.exports = KeyValueFactory;

