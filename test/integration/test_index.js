//==============================================================================
// Dependencies
//==============================================================================

var request  = require('supertest');
var should   = require('should');
var Factory  = require('rosie').Factory;

var Page = require('../../app/models/page');
require('../factories/page');

var app    = require('../../app');
var shared = require('../shared');


//==============================================================================
// Tests
//==============================================================================

describe('Index', function() {
  describe('Get /', function() {

    before(function() { this.url = '/'; });

    shared.shouldReturnOK();

    describe('with two pages in the data store', function() {
      before(function(done) {
        done();
      });

      after(function(done) {
        done();
      });

      it('should render two pages');
    });

  });
});

