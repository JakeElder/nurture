//==============================================================================
// Dependencies
//==============================================================================

var Q = require('q');
var _ = require('lodash');
var Parse; // Injected to avoid circular dependency


//==============================================================================
// Constructor
//==============================================================================

var ParseModel = function(properties) {
  this._properties = properties;
};


//==============================================================================
// Class methods
//==============================================================================

ParseModel.create = function(className) {
  var Model = _.clone(this, true);
  Model._className = className;
  delete Model.create;
  return Model;
};

ParseModel.all = function() {
  var deferred = Q.defer();
  var Model = this;
  Parse.get(this._className).then(function(models) {
    var ret = _.map(models, function(properties) {
      return new Model(properties);
    });
    deferred.resolve(ret);
  });
  return deferred.promise;
};


//==============================================================================
// Export
//==============================================================================

module.exports = function(localParse) {
  Parse = localParse;
  return ParseModel;
};

