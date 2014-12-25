//==============================================================================
// Dependencies
//==============================================================================

var Browser       = require('zombie');
var should        = require('should');
var sinon         = require('sinon');
var Parse         = require('parse');
var nock          = require('nock');

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
    it('should contain a summary section');

    describe('With no UPSELL or WHY_O2 in query string', function() {
      it('should render the WHY_O2 and UPSELL modules specified in the default query string', function() {
        return getServer().then(function(server) {
          var settingsResponse = {
            results: [{
              key: 'DEFAULT_QUERY_STRING',
              value: 'U=APPS&U=PUO&WO=MY_O2_B&WO=BLOG'
            }]
          };
          nock('https://api.parse.com').get('/1/classes/settings')
            .reply(200, settingsResponse);
          nock('https://api.parse.com').get('/1/classes/ideas')
            .reply(200, mockResponses.ideas);
          nock('https://api.parse.com').get('/1/classes/contentFragments')
            .reply(200, mockResponses.contentFragments);
          Browser.localhost(server.url);
          var browser = Browser.create();
          return browser.visit('/').then(function() {
            browser.queryAll('.idea').length.should.equal(4);
            browser.assert.text('[data-cid=APPS] .idea__sub-heading', 'Idea APPS');
            browser.assert.text('[data-cid=PUO] .idea__sub-heading', 'Idea PUO');
            browser.assert.text('[data-cid=MY_O2_B] .idea__sub-heading', 'Idea MY_O2_B');
            browser.assert.text('[data-cid=BLOG] .idea__sub-heading', 'Idea BLOG');
          }, function(err) {
            browser.resources.dump();
          }).then(function() {
            server.instance.close();
          });
        });
      });
    });

  });
});

