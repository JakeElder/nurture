//==============================================================================
// Dependencies
//==============================================================================

var Browser = require('zombie');
var should  = require('should');
var Factory = require('rosie').Factory;

var Page = require('../../app/models/page');
require('../factories/page');

var app    = require('../../app');
var shared = require('../shared');
var getServer = require('../helpers/get-server');


//==============================================================================
// Setup
//==============================================================================

Browser.default.silent = true;


//==============================================================================
// Tests
//==============================================================================

describe('Index', function() {

  'use strict';

  describe('Get /', function() {

    var server;

    before(function() {
      this.url = '/';
      return getServer().then(function(s) { server = s; });
    });

    after(function(done) {
      server.instance.close(done);
    });

    shared.shouldReturnOK();

    it('should contain a summary section', function() {
      return Browser.visit(server.url + '/').then(function(browser) {
        should(browser.query('.summary')).be.ok;
      });
    });
  });
});

