var Factory = require('rosie').Factory;

Factory.define('idea')
  .sequence('cID')
  .attr('title', ['cID'], function(cID) {
    'use strict';
    return 'Idea ' + cID;
  });
