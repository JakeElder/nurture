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
  'use strict';
  this._properties = properties;
};


//==============================================================================
// Class methods
//==============================================================================

ParseModel.create = function(className) {
  'use strict';
  var Model = _.clone(this, true);
  Model._className = className;
  delete Model.create;
  return Model;
};

ParseModel.all = function() {
  'use strict';
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
  'use strict';
  Parse = localParse;
  return ParseModel;
};

