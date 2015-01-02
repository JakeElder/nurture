//==============================================================================
// Dependencies
//==============================================================================

var Presenter = require('presenter');
var marked    = require('marked');


//==============================================================================
// Constructor
//==============================================================================

var IdeaPresenter = function(model) {
  'use strict';
  Presenter.call(this, model);
};


//==============================================================================
// Property getters/setters
//==============================================================================

/* body */
Object.defineProperty(IdeaPresenter.prototype, 'body', {
  enumerable: true,
  get: function() {
    'use strict';
    return marked(this._model._properties.body);
  }
});


//==============================================================================
// Export
//==============================================================================

module.exports = IdeaPresenter;

