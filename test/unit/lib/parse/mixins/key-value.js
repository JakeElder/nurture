//==============================================================================
// Dependencies
//==============================================================================

var should     = require('should');
var sinon      = require('sinon');
var ParseModel = require('parse/model');
var rewire     = require('rewire');
var Q          = require('q');


//==============================================================================
// Tests
//==============================================================================

describe('ParseModel key-value mixin', function() {

  'use strict';

  describe('.getHash', function() {
    it('should return a promise', function() {
      var MyModel = ParseModel.create('class');
      MyModel.mixin(require('parse/mixins/key-value')());
      var deferred = Q.defer();
      var stub = sinon.stub(MyModel, 'all').returns(deferred.promise);
      Q.isPromise(MyModel.getHash()).should.be.true;
      MyModel.all.restore();
    });

    describe('with models in data store', function() {
      it('should eventually return a hash', function() {
        var MyModel = ParseModel.create('class');
        MyModel.mixin(require('parse/mixins/key-value')());
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

    describe('with markdown fields passed', function() {
      it('should call the markdown function on keys specified', function() {
        var markedStub = sinon.stub();
        var kvMixin = rewire('parse/mixins/key-value');
        var restoreMarked = kvMixin.__set__('marked', markedStub);
        var MyModel = ParseModel.create('class');
        MyModel.mixin(kvMixin({
          markdownKeys: ['SOME_KEY']
        }));
        var deferred = Q.defer();
        deferred.resolve([ new MyModel({ key: 'SOME_KEY', value: 'SOME_VALUE' }) ]);
        var stub = sinon.stub(MyModel, 'all').returns(deferred.promise);
        return MyModel.getHash().then(function(settings) {
          markedStub.calledWith('SOME_VALUE').should.be.true;
        }).then(function() {
          MyModel.all.restore();
          restoreMarked();
        });
      });
    });
  });
});

