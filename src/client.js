/**
 * Entry point for the client component.
 * @module redtail/client
 */

import riot from 'riot'
import helloWorld from './modules/hello-world'

/* eslint-env browser */

riot.mixin({ helloWorld })

// load globals on browser window, if this is a browser
if (window) {
  window.riot = riot
}
