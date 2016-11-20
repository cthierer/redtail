/**
 * Entry point for tests.
 * @module redtail/test/entry
 */

// unit tests run on src, which must be run through babel to run
require('babel-core/register')({
  presets: ['es2015-node6', 'async-to-bluebird']
})
