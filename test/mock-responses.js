//==============================================================================
// Dependencies
//==============================================================================

var _       = require('lodash');
var Factory = require('rosie').Factory;
var Idea    = require('models/idea');

require('./factories/idea');
require('./factories/content-fragment');


//==============================================================================
// Export
//==============================================================================

module.exports = {
  ideas: {
    results: [
      Factory.build('idea', { cID: 'APPS' }),
      Factory.build('idea', { cID: 'PUO' }),
      Factory.build('idea', { cID: 'MY_O2_B' }),
      Factory.build('idea', { cID: 'BLOG' }),
      Factory.build('idea', { cID: 'TRAVEL' }),
      Factory.build('idea', { cID: 'GURU' }),
      Factory.build('idea', { cID: '4G' })
    ]
  },
  contentFragments: {
    results: _.range(10).map(function() { return Factory.build('contentFragment'); })
  }
};

