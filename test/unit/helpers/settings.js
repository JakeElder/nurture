//==============================================================================
// Dependencies
//==============================================================================

var should = require('should');
var sinon  = require('sinon');
var rewire = require('rewire');

var SettingsHelper = require('../../../app/helpers/settings');
var Parse  = rewire('../../../lib/parse/parse');


//==============================================================================
// Helpers
//==============================================================================

function withSettings(o) {
  o = o || {};
  var settings = new SettingsHelper();
  var data = o.data ? JSON.stringify(data) : '[]';
  var stub = sinon.stub().yields(null, null, '{"results":' + data + '}');
  var restoreParse = Parse.__set__({ request: stub });
  return function(cb) {
    cb(settings);
    restoreParse();
  };
}


//==============================================================================
// Tests
//==============================================================================

describe('SettingsHelper', function() {

  it('Should call Parse.get on instantiation', function() {
    var spy = sinon.spy(require('../../../lib/parse/parse'), 'get');
    withSettings()(function(){}); // Only testing instantiation
    spy.calledWith('settings').should.be.true;
  });

  describe('#get', function() {
    describe('Before ready', function() {
      it('should throw an exception when used before ready', function() {
        withSettings()(function(settings) {
          (function() {
            settings.get('SOME_SETTING');
          }).should.throw(/Not ready/);
        });
      });
    });

    describe('When ready', function() {
      it('should return a value from the data store', function() {
        withSettings()(function(settings) {
          settings.ready.state = 'fulfilled';
          settings._data = [{ key: 'SOME_SETTING', value: 'SOME_VALUE' }];
          settings.get('SOME_SETTING').should.equal('SOME_VALUE');
        });
      });
    });
  });
});

