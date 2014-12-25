//==============================================================================
// Dependencies
//==============================================================================

var Factory = require('rosie').Factory;
var lorem = require('lorem-ipsum');


//==============================================================================
// Define factory
//==============================================================================

Factory.define('contentFragment')
  .sequence('id')
  .attr('key', ['id'], function(id) { return 'CF_' + id; })
  .attr('value', ['id'], function(id) { return lorem({ count: 4, units: 'words' }); });

