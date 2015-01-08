//==============================================================================
// Dependencies
//==============================================================================

var _        = require('lodash');
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


//==============================================================================
// Ensure content sections are tall enough to show their backgrounds
//==============================================================================

(function() {
  'use strict';

  var $contentSections = $('.introduction, .idea, .summary');
  var $BGs             = $('.introduction__bg, .idea__bg, .summary__bg');

  function adjustMinHeight() {
    $contentSections.each(function(index) {
      $(this).css('min-height', $BGs.eq(index).height());
    });
  }

  adjustMinHeight();
  $(window).resize(adjustMinHeight);
})();

