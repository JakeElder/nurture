//==============================================================================
// Dependencies
//==============================================================================

var should     = require('should');
var sinon      = require('sinon');
var ParseModel = require('parse/model');
var Q          = require('q');

var MyModel = ParseModel.create('class');
MyModel.mixin(require('parse/mixins/key-value'));

//==============================================================================
// Tests
//==============================================================================

describe('ParseModel key-value mixin', function() {

  'use strict';

  describe('.getHash', function() {
    it('should return a promise', function() {
      var deferred = Q.defer();
      var stub = sinon.stub(MyModel, 'all').returns(deferred.promise);
      Q.isPromise(MyModel.getHash()).should.be.true;
      MyModel.all.restore();
    });

    describe('with models in data store', function() {
      it('should eventually return a hash', function() {
        var deferred = Q.defer();
        deferred.resolve([ new MyModel({ key: 'SOME_KEY', value: 'SOME_VALUE' }) ]);
        var stub = sinon.stub(MyModel, 'all').returns(deferred.promise);
        return MyModel.getHash().then(function(settings) {
          settings.SOME_KEY.should.equal('SOME_VALUE');
        }).then(function() {
          MyModel.all.restore();
        });
      });
    });
  });
});
