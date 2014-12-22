//==============================================================================
// Dependencies
//==============================================================================

var Parse = require('parse');
var Q     = require('q');
var _     = require('lodash');


//==============================================================================
// Model definition
//==============================================================================

debugger
var Setting = Parse.Model.create('settings');


//==============================================================================
// Class methods
//==============================================================================

Setting.getHash = function() {
  'use strict';
  var deferred = Q.defer();
  this.all().then(function(models) {
    var hash = new Setting.Hash();
    _.each(models, function(model) {
      hash[model.key] = model.value;
    });
    deferred.resolve(hash);
  });
  return deferred.promise;
};


//==============================================================================
// Export
//==============================================================================

module.exports = Setting;

