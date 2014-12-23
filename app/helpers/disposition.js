/**
 * DispositionHelper
 * =================
 * Helper class for determining the disposition of the page
 *
 * Example usage:
 * var disposition = new DispositionHelper();
 * dispostion.init({A: 'CAM'}, {A: 'FRAN'});
 * disposition.ready.then(function() {
 *   disposition.audience;
 *    => 'CAM'
 *   disposition.lifeCycle;
 *    => 'E_LIFE'
 *   disposition.callStatus;
 *    => 'Y'
 *   disposition.upsell;
 *    => ['APPS', 'TAB']
 *   disposition.whyO2;
 *    => ['TU_GO', 'PRIORITY']
 * });
 *
 */

//==============================================================================
// Dependencies
//==============================================================================

var Q           = require('q');
var _           = require('lodash');
var array       = require('ensure-array');

var NotReadyException = require('../exceptions/not-ready');


//==============================================================================
// Constructor
//==============================================================================

var DispositionHelper = function() {
  'use strict';

  // Instatiate deferred for tracking readyness
  this._deferred = Q.defer();
  this.ready = this._deferred.promise;
};
var proto = DispositionHelper.prototype;


//==============================================================================
// Class properties
//==============================================================================

DispositionHelper.PROPERTIES = {
  audience: {
    key: 'A',
    possibleValues: ['CAM', 'FRAN'],
    default: 'FRAN'
  },
  lifeCycle: {
    key: 'LC',
    possibleValues: ['E_LIFE', 'I_LIFE', 'OOC'],
    default: 'I_LIFE'
  },
  callStatus: {
    key: 'CS',
    possibleValues: ['Y', 'N'],
    default: 'N'
  },
  upsell: {
    key: 'U',
    possibleValues: ['APPS', 'TAB', 'PUO', 'BB_L'],
    default: ['APPS', 'PUO']
  },
  whyO2: {
    key: 'WO',
    possibleValues: ['MY_O2_B', 'TU_GO', 'PRIORITY', 'TRAVEL', 'WIFI', 'GURU',
      'BLOG', 'ENEWS', '4G', 'ROAM'],
    default: ['MY_O2_B', 'BLOG']
  }
};


//==============================================================================
// Property getters/setters
//==============================================================================

// Define getters for each property
_.each(DispositionHelper.PROPERTIES, function(val, property) {
  'use strict';
  Object.defineProperty(proto, property, {
    get: function() { return this._getProperty(property); }
  });
});


//==============================================================================
// Private methods
//==============================================================================

proto._getProperty = function(property) {
  'use strict';

  // Throw an exception if the instance isn't ready
  if (!this.ready.isFulfilled()) { throw new NotReadyException(); }

  // Return the value as set in the query (if present and valid)
  var queryValue = this._getQueryValue('explicit', property);
  if (queryValue) { return queryValue; }

  // Next try the default query
  var defaultQueryValue = this._getQueryValue('default', property);
  if (defaultQueryValue) { return defaultQueryValue; }

  // Otherwise return the default
  return DispositionHelper.PROPERTIES[property].default;
};

proto._getQueryValue = function(query, property) {
  'use strict';

  // Get the pertinent query string
  if (query === 'default') {
    query = this._defaultQuery;
  } else if (query === 'explicit') {
    query = this._query;
  }

  // Get property definition and the value that was passed for that property
  // in the query (if any)
  var propertyDefinition = DispositionHelper.PROPERTIES[property];
  var value              = query[propertyDefinition.key];

  // Return false if there was no value for this property in the query
  if (!value) { return false; }

  // Ensure that the value(s) is included in the array of valid values for this
  // property
  if (!this._validValue(property, value)) { return false; }

  // Value is set and valid, return it
  return value;
};

proto._validValue = function(property, value) {
  'use strict';
  var possibleValues = DispositionHelper.PROPERTIES[property].possibleValues;
  return _.every(array(value), function(val) {
    return possibleValues.indexOf(val) !== -1;
  });
};


//==============================================================================
// Public methods
//==============================================================================

proto.init = function(defaultQuery, query) {
  'use strict';
  this._defaultQuery = defaultQuery;
  this._query        = query;
  this._deferred.resolve();
};


//==============================================================================
// Export
//==============================================================================

module.exports = DispositionHelper;

