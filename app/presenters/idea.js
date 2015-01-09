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

/* backgroundImageSrc */
Object.defineProperty(IdeaPresenter.prototype, 'backgroundImageSrc', {
  enumerable: true,
  get: function() {
    'use strict';
    var dir = 'images/content-section-backgrounds/';
    if (this.number == 1) { return dir + 'first-idea.png'; }
    return dir + ['even-idea.png', 'odd-idea.png'][this.number % 2];
  }
});

/* imageSrc */
Object.defineProperty(IdeaPresenter.prototype, 'imageSrc', {
  enumerable: true,
  get: function() {
    'use strict';
    return 'images/content/' + this.cID + '.png';
  }
});

/* className */
Object.defineProperty(IdeaPresenter.prototype, 'className', {
  enumerable: true,
  get: function() {
    'use strict';
    var className = ['even', 'odd'][this.number % 2] + '-idea idea';
    if (this.number === 1) { className += ' first-idea'; }
    return className;
  }
});

//==============================================================================
// Export
//==============================================================================

module.exports = IdeaPresenter;

