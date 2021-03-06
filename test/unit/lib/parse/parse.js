//==============================================================================
// Dependencies
//==============================================================================

var Q      = require('q');
var _      = require('lodash');
var sinon  = require('sinon');
var rewire = require('rewire');
var should = require('should');

var Parse  = rewire('parse');


//==============================================================================
// Setup
//==============================================================================

var MY_APP_ID       = 'MY_APP_KEY';
var MY_REST_API_KEY = 'MY_API_KEY';


//==============================================================================
// Helpers
//==============================================================================

function getParse(unconfigured) {
  'use strict';
  var localParse = _.clone(Parse, true);
  if (unconfigured) { return localParse; }
  return configureParse(localParse);
}

function configureParse(localParse) {
  'use strict';
  return localParse.configure(MY_APP_ID, MY_REST_API_KEY);
}


//==============================================================================
// Tests
//==============================================================================

describe('Parse', function() {

  'use strict';

  describe('.configure', function() {
    it('should set APP_ID and REST_API_KEY', function() {
      var Parse = getParse(true);
      Parse.configure(MY_APP_ID, MY_REST_API_KEY);
      Parse.should.have.properties({
        APP_ID: MY_APP_ID,
        REST_API_KEY: MY_REST_API_KEY
      });
    });
  });

  describe('.get', function() {
    it('should make a GET request to the Parse API', function() {
      var spy = sinon.spy();
      Parse.__with__({ request: spy })(function() {
        getParse().get('models');
      });
      spy.calledWith({
        url: Parse.API_URL + 'classes/models',
        headers: {
          'X-Parse-Application-Id': Parse.APP_ID,
          'X-Parse-REST-API-Key': Parse.REST_API_KEY
        }
      }).should.be.true;
    });

    it('should return a promise', function() {
      Q.isPromise(getParse().get('models')).should.be.true;
    });

    it('should eventually return an array', function() {
      var promise;
      var stub = sinon.stub().yields(null, null, '{"results":[]}');
      Parse.__with__({ request: stub })(function() {
        promise = getParse().get('models');
      });
      return promise.then(function(models) {
        models.should.be.instanceOf(Array);
      });
    });

    describe('with models in data store', function() {
      it('should eventually return an array of objects', function() {
        var promise;
        var mockJSON = JSON.stringify({
          results: [{ objectId: "abc" }, { objectId: "def" }]
        });
        var stub = sinon.stub().yields(null, null, mockJSON);
        Parse.__with__({ request: stub })(function() {
          promise = getParse().get('models');
        });
        return promise.then(function(models) {
          models.length.should.be.above(0);
          _.each(models, function(model) {
            model.should.be.instanceOf(Object);
          });
        });
      });
    });
  });

});

