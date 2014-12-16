/**
 * DispositionHelper
 * =================
 * Helper class for determining the disposition of the page
 *
 * Example usage:
 * var disposition = new DispositionHelper(queryString);
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

var Q                 = require('q');
var _                 = require('lodash');
var querystring       = require('querystring');
var array             = require('ensure-array');

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

Object.defineProperty(proto, 'queryString', {
  set: function(string) {
    'use strict';
    this._queryString = querystring.parse(string);
    this._deferred.resolve();
  }
});


//==============================================================================
// Private functions
//==============================================================================

proto._getProperty = function(property) {
  'use strict';

  // Throw an exception if the instance isn't ready
  if (this.ready.state !== 'fulfilled') { throw new NotReadyException(); }

  // Return the value as set in the query string (if present and valid)
  var queryStringValue = this._getQueryStringValue(property);
  if (queryStringValue) { return queryStringValue; }

  // Otherwise return the default
  return DispositionHelper.PROPERTIES[property].default;
};

proto._getQueryStringValue = function(property) {
  'use strict';

  // No query string value if no query string
  if (!this._queryString) { return false; }

  // Get property definition and the value that was passed for that property
  // in the query string (if any)
  var propertyDefinition = DispositionHelper.PROPERTIES[property];
  var value = this._queryString[propertyDefinition.key];

  // Return false if there was no value for this property in the query string
  if (!value) { return false; }

  // Ensure that the value(s) is included in the array of valid values for this
  // property
  var possibleValues = DispositionHelper.PROPERTIES[property].possibleValues;
  var validValues = _.every(array(value), function(val) {
    return possibleValues.indexOf(val) !== -1;
  });

  // Return false if any of the values specified in the query string are invalid
  if (!validValues) { return false; }

  // Return the value specified in the set query string
  return value;
};


//==============================================================================
// Export
//==============================================================================

module.exports = DispositionHelper;

