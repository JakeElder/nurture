//==============================================================================
// Dependencies
//==============================================================================

var should  = require('should');
var sinon   = require('sinon');
var Setting = require('models/setting');
var Parse   = require('parse');
var Q       = require('q');


//==============================================================================
// Tests
//==============================================================================

describe('Setting', function() {

  'use strict';

  describe('.getHash', function() {
    it('should return a promise', function() {
      var deferred = Q.defer();
      var stub = sinon.stub(Setting, 'all').returns(deferred.promise);
      Q.isPromise(Setting.getHash()).should.be.true;
      Setting.all.restore();
    });

    it('should eventually return a Setting.Hash', function() {
      var deferred = Q.defer();
      deferred.resolve([]);
      var stub = sinon.stub(Setting, 'all').returns(deferred.promise);
      return Setting.getHash().then(function(settings) {
        settings.should.be.instanceOf(Setting.Hash);
      }).then(function() {
        Setting.all.restore();
      });
    });

    describe('with models in data store', function() {
      it('should eventually return a hash', function() {
        var deferred = Q.defer();
        deferred.resolve([ new Parse.Model({ key: 'SOME_KEY', value: 'SOME_VALUE' }) ]);
        var stub = sinon.stub(Setting, 'all').returns(deferred.promise);
        return Setting.getHash().then(function(settings) {
          settings.SOME_KEY.should.equal('SOME_VALUE');
        }).then(function() {
          Setting.all.restore();
        });
      });
    });
  });
});
