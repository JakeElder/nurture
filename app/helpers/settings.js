//==============================================================================
// Dependencies
//==============================================================================

var Q = require('q');
var _ = require('lodash');

var Parse             = require('../../lib/parse/parse');
var NotReadyException = require('../../app/exceptions/not-ready');


//==============================================================================
// Constructor
//==============================================================================

var SettingsHelper = function() {
  'use strict';

  // Instantiate deferred for tracking readyness
  this._deferred = Q.defer();
  this.ready = this._deferred.promise;

  // Make call to parse to get settings, store the result and resolve deferred
  // once done
  var settings = this;
  Parse.get('settings').then(function(data) {
    settings._data = data;
    settings._deferred.resolve();
  });
};
var proto = SettingsHelper.prototype;


//==============================================================================
// Public methods
//==============================================================================

proto.get = function(key) {
  'use strict';

  // Throw an exception if the instance isn't ready
  if (this.ready.state !== 'fulfilled') { throw new NotReadyException(); }

  // Find the data store entry that has the passed key
  var entry = _.find(this._data, { key: key });

  // Return undefined if no entry with that key exists
  if (_.isUndefined(entry)) { return undefined; }

  // Return the value
  return entry.value;
};


//==============================================================================
// Export
//==============================================================================

module.exports = SettingsHelper;
