//==============================================================================
// Dependencies
//==============================================================================

var Q                 = require('q');
var _                 = require('lodash');
var querystring       = require('querystring');
var marked            = require('marked');

var ContentFragment   = require('models/content-fragment');
var Idea              = require('models/idea');
var IdeaPresenter     = require('presenters/idea');
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

/* introduction */
Object.defineProperty(proto, 'introduction', {
  enumerable: true,
  get: function() {
    'use strict';

    // Get the right copy based on LIFE_CYCLE and CALL_STATUS params
    var copyKey = 'INTRODUCTION_COPY_' +
      this._disposition.lifeCycle + '_' +
      this._disposition.callStatus;

    return {
      heading: this._contentFragments.INTRODUCTION_HEADING,
      copy: marked(this._contentFragments[copyKey]),
      goad: this._contentFragments.INTRODUCTION_GOAD
    };
  }
});

/* ideas */
Object.defineProperty(proto, 'ideas', {
  enumerable: true,
  get: function() {
    'use strict';

    var viewModel = this;

    var ideas = this._disposition.ideas.map(function(cID, idx) {
      var idea = new IdeaPresenter(_.find(this._ideas, { cID: cID }));
      idea.number = idx + 1;
      return idea;
    }, this);

    return ideas;
  }
});

/* summary */
Object.defineProperty(proto, 'summary', {
  enumerable: true,
  get: function() {
    'use strict';
    return {
      heading: this._contentFragments.SUMMARY_HEADING,
      copy: this._contentFragments.SUMMARY_COPY
    };
  }
});

/* termsAndConditions */
Object.defineProperty(proto, 'termsAndConditions', {
  enumerable: true,
  get: function() {
    'use strict';
    return {
      heading: this._contentFragments.TERMS_AND_CONDITIONS_HEADING,
      copy: marked(this._contentFragments.TERMS_AND_CONDITIONS_COPY)
    };
  }
});

/* footer */
Object.defineProperty(proto, 'footer', {
  enumerable: true,
  get: function() {
    'use strict';
    var content = this._contentFragments;
    return {
      termsAndConditionsLabel: content.FOOTER_TERMS_AND_CONDITIONS_LABEL,
      copyrightCopy: content.FOOTER_COPYRIGHT_COPY
    };
  }
});


//==============================================================================
// Export
//==============================================================================

module.exports = IndexViewModel;

