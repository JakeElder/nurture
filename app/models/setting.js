//==============================================================================
// Dependencies
//==============================================================================

var Model = require('parse/model');
var Q     = require('q');
var _     = require('lodash');


//==============================================================================
// Model definition
//==============================================================================

var Setting = Model.create('settings');
Setting.Hash = function() {};


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

