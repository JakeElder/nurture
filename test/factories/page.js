var Factory = require('rosie').Factory;

Factory.define('page')
  .sequence('cID')
  .sequence('title', function(i) {
    'use strict';
    return 'Page ' + i;
  });
