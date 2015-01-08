//==============================================================================
// Dependencies
//==============================================================================

var Browser       = require('zombie');
var should        = require('should');
var sinon         = require('sinon');
var Parse         = require('parse');
var nock          = require('nock');
var _             = require('lodash');
var Q             = require('q');

var app           = require('../../app');
var shared        = require('../shared');
var getServer     = require('../helpers/get-server');
var mockResponses = require('../mock-responses');


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
    var browser;
    var server;

    before(function() {
      return getServer().then(function(s) {
        server = s;
        Browser.localhost(server.url);
        browser = Browser.create();
      });
    });

    beforeEach(function() {
    });

    after(function() {
      server.instance.close();
    });

    it('should render introduction copy based on the LIFE_CYCLE and CALL_STATUS params', function() {
      var handleFail = function(err) {
        browser.resources.dump();
      };
      nock('https://api.parse.com').get('/1/classes/settings').times(3)
        .reply(200, { results: [] });
      nock('https://api.parse.com').get('/1/classes/contentFragments').times(3)
        .reply(200, mockResponses.contentFragments);
      nock('https://api.parse.com').get('/1/classes/ideas').times(3)
        .reply(200, mockResponses.ideas);
      return Q.fcall(function() {
        return browser.visit('/?LC=E_LIFE&CS=N').then(function() {
          browser.assert.text('.introduction__copy', 'E_LIFE_N copy');
        }, handleFail);
      }).then(function() {
        return browser.visit('/?LC=E_LIFE&CS=Y').then(function() {
          browser.assert.text('.introduction__copy', 'E_LIFE_Y copy');
        }, handleFail);
      }).then(function() {
        return browser.visit('/?LC=OOC&CS=Y').then(function() {
          browser.assert.text('.introduction__copy', 'OOC_Y copy');
        }, handleFail);
      });
    });

    describe('With no IDEAS set in the query string', function() {
      it('should render the idea modules specified in the default query string', function() {
        var settingsResponse = {
          results: [{
            key: 'DEFAULT_QUERY_STRING',
            value: 'I=APPS&I=PUO&I=MY_O2_B&I=BLOG'
          }]
        };
        nock('https://api.parse.com').get('/1/classes/settings')
          .reply(200, settingsResponse);
        nock('https://api.parse.com').get('/1/classes/ideas')
          .reply(200, mockResponses.ideas);
        nock('https://api.parse.com').get('/1/classes/contentFragments')
          .reply(200, mockResponses.contentFragments);
        return browser.visit('/').then(function() {
          browser.queryAll('.idea').length.should.equal(4);
          browser.assert.text('[data-cid=APPS] .idea__sub-heading', 'Idea APPS');
          browser.assert.text('[data-cid=PUO] .idea__sub-heading', 'Idea PUO');
          browser.assert.text('[data-cid=MY_O2_B] .idea__sub-heading', 'Idea MY_O2_B');
          browser.assert.text('[data-cid=BLOG] .idea__sub-heading', 'Idea BLOG');
        }, function(err) {
          browser.resources.dump();
        });
      });
    });

  });
});

