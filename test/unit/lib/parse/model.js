//==============================================================================
// Dependencies
//==============================================================================

var Q          = require('q');
var _          = require('lodash');
var sinon      = require('sinon');
var rewire     = require('rewire');
var should     = require('should');

var Parse      = require('parse');
var ParseModel = require('parse/model');


//==============================================================================
// Setup
//==============================================================================

var MyModel = ParseModel.create('class');


//==============================================================================
// Tests
//==============================================================================

describe('ParseModel', function() {

  'use strict';

  describe('.all', function() {
    it('should invoke Parse.get with the class name', function() {
      var spy = sinon.spy(Parse, 'get');
      MyModel.all();
      spy.calledWith('class').should.be.true;
      Parse.get.restore();
    });

    it('should return a promise', function() {
      Q.isPromise(MyModel.all()).should.be.true;
    });

    it('should eventually return an array', function() {
      var deferred = Q.defer();
      deferred.resolve([]);
      var stub = sinon.stub(Parse, 'get').returns(deferred.promise);
      return MyModel.all().then(function(models) {
        models.should.be.instanceOf(Array);
      }).then(function() {
        Parse.get.restore();
      });
    });

    describe('with models in data store', function() {
      it('should eventually return an array of objects', function() {
        var deferred = Q.defer();
        deferred.resolve([{ objectId: 'abc' }, { objectId: 'def' }]);
        var stub = sinon.stub(Parse, 'get').returns(deferred.promise);
        return MyModel.all().then(function(models) {
          _.each(models, function(model) {
            model.should.be.instanceOf(MyModel);
          });
        }).then(function() {
          Parse.get.restore();
        });
      });
    });
  });

  describe('.filter', function() {
    it('should invoke .all', function() {
      var spy = sinon.spy(MyModel, 'all');
      MyModel.filter();
      spy.calledOnce.should.be.true;
      MyModel.all.restore();
    });

    it('should return a promise', function() {
      Q.isPromise(MyModel.filter()).should.be.true;
    });

    it('should eventually return an array', function() {
      var deferred = Q.defer();
      deferred.resolve([]);
      var stub = sinon.stub(MyModel, 'all').returns(deferred.promise);
      return MyModel.filter().then(function(models) {
        models.should.be.instanceOf(Array);
      }).then(function() {
        MyModel.all.restore();
      });
    });

    it('should eventually invoke _.filter on models returned by all', function() {
      var models = [new MyModel(), new MyModel()];
      var criteria = {};
      var deferred = Q.defer();
      deferred.resolve(models);
      var stub = sinon.stub(MyModel, 'all').returns(deferred.promise);
      var spy = sinon.spy(_, 'filter');
      return MyModel.filter(criteria).then(function() {
        _.filter.calledWith(models, criteria).should.be.true;
      }).then(function() {
        MyModel.all.restore();
        _.filter.restore();
      });
    });
  });

});


