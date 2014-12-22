//==============================================================================
// Dependencies
//==============================================================================

var Browser = require('zombie');
var should  = require('should');
var sinon   = require('sinon');
var Parse   = require('parse');
var nock    = require('nock');
var Factory = require('rosie').Factory;

var Idea = require('models/idea');
require('../factories/idea');

var app       = require('../../app');
var shared    = require('../shared');
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
    before(function() {
      this.url = '/';
    });

    it('should contain a summary section');

    describe('With no UPSELL in query string', function() {
      it('should render the UPSELL modules specified in the default query string', function() {
        return getServer().then(function(server) {
          nock('https://api.parse.com').get('/1/classes/settings')
            .reply(200, {
              results: [{ key: 'DEFAULT_QUERY_STRING', value: 'U=APPS&U=BB_L' }]
            });
          nock('https://api.parse.com').get('/1/classes/ideas')
            .reply(200, {
              results: [
                { cID: 'APPS', heading: 'Apps for business' },
                { cID: 'TAB', heading: 'Tab heading' },
                { cID: 'BB_L', heading: 'Say goodbye to buffering' }
              ]
            });
          Browser.localhost(server.url);
          var browser = Browser.create();
          return browser.visit('/').then(function() {
            browser.queryAll('.idea').length.should.equal(2);
            browser.assert.text('[data-cid=APPS] .idea__heading', 'Apps for business');
            browser.assert.text('[data-cid=BB_L] .idea__heading', 'Say goodbye to buffering');
          }).then(function() {
            server.instance.close();
          });
        });
      });
    });

  });
});

