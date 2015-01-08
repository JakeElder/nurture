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
    return [
      'images/content-section-backgrounds/small/arrow-bg-to-bl.png',
      'images/content-section-backgrounds/small/arrow-bg-to-br.png'
    ][this.number % 2];
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
    return ['even', 'odd'][this.number % 2] + '-idea idea';
  }
});

//==============================================================================
// Export
//==============================================================================

module.exports = IdeaPresenter;

