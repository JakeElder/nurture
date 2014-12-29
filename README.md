O2 Nurture
----------
O2 Nurture is a simple web app, aimed at coaxing O2 business customers in to
downloading apps that may help them improve their business.

Generally O2 customers will receive a phone call, then be SMS'd a link with a
link to the site. Based on responses to questions asked during the phone call,
the site will display content most suitable for the user.

The application is built using Node and Express.

Content is retrieved from Parse, and is selectively displayed based upon the
query string in the url. If no query is string is present, page disposition is
dictated by a "default query string", which is found in the settings data store
in Parse. Speak to Jon Chandler for access to Parse.


## Installation
Download the repo, install node dependencies

```
git clone git@bitbucket.org:mcsaatchi/o2_nurture.git
cd o2_nurture
npm install
```


## Development
To start the express server, run `npm start`.
The project uses Gulp to start the express server and restart on changes.

### Back end
The project uses Express. Models/controllers and helpers etc are in the **app/**
directory. A basic library for retrieving data from Parse is in the
**lib/parse/** directory. Tests are in the **test/** directory. To test, run
`npm test`.

#### NODE_PATH
`npm start` sets the NODE_PATH environmental variable before starting the
server. This is so modules from certain directories can be required using
absolute notation rather than relative. EG instead of
require('../../lib/parse/parse'), require('parse') can be written. See
**package.json** for a list of paths set. These paths will need to be added
when invoking app code without using `npm start`. EG, to run the tests in a
single file,

```
NODE_PATH=./app:./app/adapters:./config:./lib/parse NODE_ENV=test mocha test/integration/test_index.js
```
#### View models
View models are responsible for collating and exposing an interface for
outputting all the data needed for a particular view. They should be
instantiated from their relevant controller, and passed directly to res.render.

#### Helpers
Helpers are for encapsulating domain specific logic related to a distinct set of
tasks in order to keep controllers light.

#### Adapters
Adapters are used as a convenience where a module is to be used as a singleton.
IE where a module is instantiated with new Module(), but only one instance
should be available application wide.

### Front end
Front end code is located in the **client/** directory. The project uses SCSS
with the Bourbon mixin library, Jade templates and browserify to build JS.

#### SCSS
SCSS is written using BEM notation. All changes to SCSS, including new files
should trigger a livereload change event, and result in CSS being refreshed
without page reload. This applies to the generation of the sprite sheet and
the vector font.

##### Sprites
Sprites are generated automatically from images placed in the
**client/images/ui-elements/** directory. Two spritesheets and accompanying SCSS
are generated automatically whenever changes/additions are made to images in
that directory. Images should be in retina .png format (2x size, with even
width, height). Non retina images are generated automatically from the retina
version. The SCSS generated is written to **client/scss/base/_ui-elements.scss**
. All non sprite images should be put in the **public/images/** directory.

##### SVG font
All vectors should be built in to the SVG font. The font is automatically
generated on changes/addition to the **client/images/vectors** directory.
The font SCSS generate is written to **client/scss/base/_vector-font.scss**.

#### JS
JS is built using Browserify, and is handled by Express middleware (as opposed
to a Gulp task). Changes should trigger a live reload.


## Deployment

**TODO**

