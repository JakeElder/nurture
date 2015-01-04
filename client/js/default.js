//==============================================================================
// Dependencies
//==============================================================================

var Carousel = require('carousel');


//==============================================================================
// Setup
//==============================================================================

window.app = {};


//==============================================================================
// Instantiate Carousel
//==============================================================================

(function(app) {
  'use strict';

  app.carousel = new Carousel($('.carousel').get(0));

  var content            = document.getElementById('content');
  var termsAndConditions = document.getElementById('terms-and-conditions');

  $('.site-footer__tnc-link').click(function() {
    app.carousel.show(termsAndConditions);
  });

  $('.terms-and-conditions__back-link').click(function() {
    app.carousel.show(content);
  });
})(window.app);

