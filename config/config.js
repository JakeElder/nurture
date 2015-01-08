//==============================================================================
// Dependencies
//==============================================================================

var extend = require('util')._extend;


//==============================================================================
// Setup
//==============================================================================

var base        = {};
var development = extend({}, base);
var test        = extend({}, base);
var production  = extend({}, base);

//==============================================================================
// Export
//==============================================================================

module.exports = {
  development: extend(development, {
    PARSE_APP_ID: 'qAt9umROGGOaiHPt7j2fB3JVoMnYi3SebtcxxS1z',
    PARSE_REST_API_KEY: 'I4H2aAz7xn5lr9ZrEwstHZvVZiQ8gdnAXCiFMZEj'
  }),
  test: extend(base, {
    PARSE_APP_ID: 'letsnottestparsesapishallwe',
    PARSE_REST_API_KEY: 'imsuretheyhaveitcovered'
  }),
  production: extend(production, {
    PARSE_APP_ID: 'qAt9umROGGOaiHPt7j2fB3JVoMnYi3SebtcxxS1z',
    PARSE_REST_API_KEY: 'I4H2aAz7xn5lr9ZrEwstHZvVZiQ8gdnAXCiFMZEj'
  })
}[process.env.NODE_ENV];

