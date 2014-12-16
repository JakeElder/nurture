//==============================================================================
// Dependencies
//==============================================================================

var should            = require('should');
var sinon             = require('sinon');

var DispositionHelper = require('../../../app/helpers/disposition');
var NotReadyException = require('../../../app/exceptions/not-ready');


//==============================================================================
// Helpers
//==============================================================================

function getDisposition(o) {
  o = o || {};
  var disposition = new DispositionHelper();
  if (o.ready) { disposition.ready.state = 'fulfilled'; }
  return disposition;
}


//==============================================================================
// Tests
//==============================================================================

describe('DispositionHelper', function() {

  describe('Before ready', function() {
    it('should raise an exception when used before ready', function() {
      var disposition = getDisposition();
      (function() {
        disposition.audience;
      }).should.throw(/Not ready/);
    });
  });

  describe('When ready', function() {
    it('should return default values for each property', function() {
      var disposition = getDisposition({ ready: true });
      for (var property in DispositionHelper.PROPERTIES) {
        var defaultValue = DispositionHelper.PROPERTIES[property].default;
        disposition[property].should.equal(defaultValue);
      }
    });

    describe('With a query string set', function() {
      var disposition;

      before(function() {
        disposition = getDisposition({ ready: true });
      });

      it('should give precedence to explicitly set properties', function() {
        disposition.queryString = 'A=CAM';
        disposition.audience.should.equal('CAM');
      });

      it('should revert to a default value when supplied invalid', function() {
        disposition.queryString = 'A=INVALID';
        var defaultValue = DispositionHelper.PROPERTIES.audience.default;
        disposition.audience.should.equal(defaultValue);
      });

      describe('With multiple valid values set', function() {
        it('should return the supplied array of values', function() {
          disposition.queryString = 'U=TAB&U=PUO';
          disposition.upsell.should.eql(['TAB', 'PUO']);
        });
      });

      describe('With multiple values, including invalid ones', function() {
        it('should return the default value', function() {
          disposition.queryString = 'U=INVALID&U=PUO';
          var defaultValue = DispositionHelper.PROPERTIES.upsell.default;
          disposition.upsell.should.eql(defaultValue);
        });
      });
    });
  });

});

