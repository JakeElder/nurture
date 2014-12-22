//==============================================================================
// Dependencies
//==============================================================================

var Q       = require('q');
var should  = require('should');

var DispositionHelper = require('../../../app/helpers/disposition');


//==============================================================================
// Helpers
//==============================================================================

function getDisposition(o) {
  o              = o              || {};
  o.defaultQuery = o.defaultQuery || {};
  o.query        = o.query        || {};

  if (!('initialized' in o)) { o.initialized = true; }

  var disposition = new DispositionHelper();
  if (o.initialized) { disposition.init(o.defaultQuery, o.query); }

  return disposition;
}


//==============================================================================
// Tests
//==============================================================================

describe('DispositionHelper', function() {

  describe('Before ready', function() {
    it('should raise an exception when used before ready', function() {
      var disposition = getDisposition({ initialized: false });
      (function() {
        disposition.audience;
      }).should.throw(/Not ready/);
    });
  });

  describe('When ready', function() {
    it('should return default values for each property', function() {
      var disposition = getDisposition();
      for (var property in DispositionHelper.PROPERTIES) {
        var defaultValue = DispositionHelper.PROPERTIES[property].default;
        disposition[property].should.equal(defaultValue);
      }
    });

    describe('With a query set', function() {
      it('should give precedence to values set in the query',
        function() {
          var disposition = getDisposition({
            query: { A: 'CAM' }
          });
          disposition.audience.should.equal('CAM');
        }
      );

      it('should give precedence to values in the default query when ' +
        'there is no valid value in the query',
        function() {
          var disposition = getDisposition({
            defaultQuery: { A: 'CAM' },
            query: { A: 'INVALID' }
          });
          disposition.audience.should.equal('CAM');
        }
      );

      it('should revert to a default value in the abscence of a valid query ' +
        'or default query value',
        function() {
          var disposition = getDisposition({
            defaultQuery: { A: 'INVALID' },
            query: { A: 'INVALID' }
          });
          var defaultValue = DispositionHelper.PROPERTIES.audience.default;
          disposition.audience.should.equal(defaultValue);
        }
      );

      describe('With multiple valid values set', function() {
        it('should return the supplied array of values', function() {
          var disposition = getDisposition({
            query: { U: ['TAB', 'PUO'] }
          });
          disposition.upsell.should.eql(['TAB', 'PUO']);
        });
      });

      describe('With multiple values, including invalid ones', function() {
        it('should return the default value', function() {
          var disposition = getDisposition({
            query: { U: ['INVALID', 'PUO'] }
          });
          var defaultValue = DispositionHelper.PROPERTIES.upsell.default;
          disposition.upsell.should.eql(defaultValue);
        });
      });
    });
  });

});

