//==============================================================================
// Dependencies
//==============================================================================

var http    = require('http');
var Q       = require('q');
var request = require('request');


//==============================================================================
// Constructor
//==============================================================================

var Parse = function() {};


//==============================================================================
// Class properties
//==============================================================================

Parse.Model        = require('./parse/model')(Parse);
Parse.API_URL      = 'https://api.parse.com/1/';
Parse.APP_ID       = null;
Parse.REST_API_KEY = null;


//==============================================================================
// Class methods
//==============================================================================

Parse.configure = function(APP_ID, REST_API_KEY) {
  'use strict';
  this.APP_ID       = APP_ID;
  this.REST_API_KEY = REST_API_KEY;
  return this;
};

Parse.get = function(className) {
  'use strict';
  var deferred = Q.defer();
  var url = this.API_URL + 'classes/' + className;
  request({
    url: url,
    headers: {
      'X-Parse-Application-Id': this.APP_ID,
      'X-Parse-REST-API-Key': this.REST_API_KEY
    }
  }, function(error, response, body) {
    deferred.resolve(JSON.parse(body).results);
  });
  return deferred.promise;
};


//==============================================================================
// Export
//==============================================================================

module.exports = Parse;

