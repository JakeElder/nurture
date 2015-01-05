//==============================================================================
// Dependencies
//==============================================================================

var _       = require('lodash');
var Factory = require('rosie').Factory;
var Idea    = require('models/idea');
var lorem   = require('lorem-ipsum');

require('./factories/idea');
require('./factories/content-fragment');


//==============================================================================
// Export
//==============================================================================

module.exports = {
  ideas: {
    results: [
      Factory.build('idea', { cID: 'APPS' }),
      Factory.build('idea', { cID: 'PUO' }),
      Factory.build('idea', { cID: 'MY_O2_B' }),
      Factory.build('idea', { cID: 'BLOG' }),
      Factory.build('idea', { cID: 'TRAVEL' }),
      Factory.build('idea', { cID: 'GURU' }),
      Factory.build('idea', { cID: '4G' })
    ]
  },
  contentFragments: {
    results: [
      { 'key': 'INTRODUCTION_COPY', value: lorem() },
      { 'key': 'TERMS_AND_CONDITIONS_COPY', value: lorem() },
      { 'key': 'INTRODUCTION_COPY_E_LIFE_N', value: 'E_LIFE_N copy' },
      { 'key': 'INTRODUCTION_COPY_I_LIFE_N', value: 'I_LIFE_N copy' },
      { 'key': 'INTRODUCTION_COPY_OOC_N', value: 'OOC_N copy' },
      { 'key': 'INTRODUCTION_COPY_E_LIFE_Y', value: 'E_LIFE_Y copy' },
      { 'key': 'INTRODUCTION_COPY_I_LIFE_Y', value: 'I_LIFE_Y copy' },
      { 'key': 'INTRODUCTION_COPY_OOC_Y', value: 'OOC_Y copy' },
    ]
  }
};

