//==============================================================================
// Dependencies
//==============================================================================

var Factory = require('rosie').Factory;
var lorem = require('lorem-ipsum');


//==============================================================================
// Define factory
//==============================================================================

Factory.define('idea')
  .sequence('cID')
  .attr('heading', ['cID'], function(cID) { return 'Idea ' + cID; })
  .attr('body', ['cID'], function(cID) { return 'Idea ' + cID + '. ' + lorem(); })
  .attr('ctaLabel', ['cID'], function(cID) { return 'Idea ' + cID + ' CTA'; })
  .attr('ctaLink', ['cID'], function(cID) { return 'http://example.com/' + cID; });

