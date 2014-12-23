//==============================================================================
// Dependencies
//==============================================================================

var Q = require('q');
var _ = require('lodash');


//==============================================================================
// Export
//==============================================================================

module.exports = {
  classMethods: {
    getHash: function() {
      'use strict';
      var deferred = Q.defer();
      this.all().then(function(models) {
        var hash = {};
        _.each(models, function(model) {
          hash[model.key] = model.value;
        });
        deferred.resolve(hash);
      });
      return deferred.promise;
    }
  }
};

