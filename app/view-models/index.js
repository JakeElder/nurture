//==============================================================================
// Dependencies
//==============================================================================

var Q           = require('q');
var _           = require('lodash');
var querystring = require('querystring');

var ContentFragment   = require('models/content-fragment');
var Idea              = require('models/idea');
var Setting           = require('models/setting');
var DispositionHelper = require('helpers/disposition');


//==============================================================================
// Constructor
//==============================================================================

var IndexViewModel = function(query) {
  'use strict';

  var viewModel = this;

  this._deferred = Q.defer();
  this.ready = this._deferred.promise;

  var promises = [
    Idea.all(),
    Setting.getHash(),
    ContentFragment.getHash()
  ];

  Q.all(promises).spread(function(ideas, settings, contentFragments) {
    try {
      // Save reference to helpers
      viewModel._ideas            = ideas;
      viewModel._settings         = settings;
      viewModel._contentFragments = contentFragments;
      viewModel._disposition      = new DispositionHelper();

      // Initialize disposition
      var defaultQuery = querystring.parse(settings.DEFAULT_QUERY_STRING);
      viewModel._disposition.init(defaultQuery, query);

      // Everythings ready, resolve deferred
      viewModel._deferred.resolve(viewModel);
    } catch(err) {
      viewModel._deferred.reject(err);
    }
  });
};
var proto = IndexViewModel.prototype;


//==============================================================================
// Property getters/setters
//==============================================================================

/* title */
Object.defineProperty(proto, 'title', {
  enumerable: true,
  get: function() {
    'use strict';
    return this._settings.DOCUMENT_TITLE;
  }
});

/* ideas */
Object.defineProperty(proto, 'ideas', {
  enumerable: true,
  get: function() {
    'use strict';

    // Save reference to this
    var viewModel = this;

    // Filter down to the needed ideas
    var ideas = this._ideas.filter(function(idea) {
      console.log(viewModel._disposition.upsell);
      return viewModel._disposition.upsell.indexOf(idea.cID) !== -1;
    });

    // Sort according to order in disposition
    ideas.sort(function(a, b) {
      var aIndex = viewModel._disposition.upsell.indexOf(a.cID);
      var bIndex = viewModel._disposition.upsell.indexOf(b.cID);
      return aIndex - bIndex;
    });

    return ideas;
  }
});


//==============================================================================
// Export
//==============================================================================

module.exports = IndexViewModel;

