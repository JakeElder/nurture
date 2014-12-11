//==============================================================================
// Dependencies
//==============================================================================

var Q          = require('q');
var _          = require('lodash');
var sinon      = require('sinon');
var rewire     = require('rewire');
var should     = require('should');

var Parse = require('../../../../lib/parse/parse');


//==============================================================================
// Setup
//==============================================================================

var MyModel = Parse.Model.create('class');


//==============================================================================
// Tests
//==============================================================================

describe('Parse.Model', function() {

  describe('#all', function() {
    it('should invoke Parse.get with the class name', function() {
      var spy = sinon.spy(Parse, 'get');
      MyModel.all();
      spy.calledWith('class').should.equal(true);
      Parse.get.restore();
    });

    it('should return a promise', function() {
      Q.isPromise(MyModel.all()).should.equal(true);
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

});

