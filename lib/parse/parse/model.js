//==============================================================================
// Dependencies
//==============================================================================

var Q     = require('q');
var _     = require('lodash');
var Parse = require('../parse');


//==============================================================================
// Constructor
//==============================================================================

var ParseModel = function(properties) {
  'use strict';
  this._properties = properties || {};
  var model = this;
  _.each(Object.keys(this._properties), function(key) {
    Object.defineProperty(model, key, {
      get: function() { return model._properties[key]; }
    });
  });
};
var proto = ParseModel.prototype;


//==============================================================================
// Class methods
//==============================================================================

ParseModel.create = function(className) {
  'use strict';
  var Model        = this.bind({});
  Model.all        = this.all;
  Model.filter     = this.filter;
  Model.mixin      = this.mixin;
  Model.prototype = _.extend({}, proto);
  Model._className = className;
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

ParseModel.filter = function(criteria) {
  'use strict';
  var deferred = Q.defer();
  this.all().then(function(models) {
    deferred.resolve(_.filter(models, criteria));
  });
  return deferred.promise;
};

ParseModel.mixin = function(mixin) {
  'use strict';
  _.extend(this, mixin.classMethods);
};


//==============================================================================
// Export
//==============================================================================

module.exports = ParseModel;

