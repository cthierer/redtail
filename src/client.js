/* eslint-env browser */

/**
 * Entry point for the client component.
 * @module redtail/client
 */

import riot from 'riot/riot'
import octicons from 'octicons'
import numeral from 'numeral'
import leaflet from 'leaflet/dist/leaflet'
import moment from 'moment'
import uuid from 'uuid'
import * as http from './modules/data/http'
import * as actions from './modules/core/actions'
import * as utils from './modules/utils'
import * as neighborhoods from './modules/neighborhoods/tags'
import * as rodents from './modules/rodents/tags'
import * as establishments from './modules/establishments/tags'
import { init } from './tags'

// load globals on browser window, if this is a browser
window.riot = riot

/**
 * The global application state. This is passed into all top-level tags,
 * which may chose to extend it to lower tags as necessary.
 * @type {State}
 */
const globalState = actions.initState()()

/**
 * Mount a tag as the main application tag.
 * @returns {function} Returns a mount function that when called with a tag
 *  name and options object, will mount the tag as the main applicaiton tag.
 */
function mount() {
  return (tag, opts = {}) => {
    riot.mount('#redtailApp', tag, Object.assign({
      state: globalState
    }, opts))
  }
}

/**
 * Define an action for a given route.
 * @param {string} basePath The base path for all routes defined through
 *  the resulting route function.
 * @returns {function} The route function that when called, configured Riot
 *  to route the application to the specifid path.
 */
function route(basePath) {
  return (path, action) => {
    riot.route(utils.urls.join(basePath, path), action)
  }
}

/**
 * Define a mixin to load in the application.
 * @returns {function} The mixinim function that when called, loads the mixin
 *  into Riot.
 */
function mixin() {
  return (...args) => {
    riot.mixin(...args)
  }
}

// global mixins
riot.mixin({
  icons: octicons,
  initState: actions.initState(),
  number: numeral,
  moment,
  refresh: () => globalState.refresh(),
  uuid
})

// namespaced mixins
riot.mixin('leaflet', { leaflet })

// initialization:
// 1. get the application configuration
// 2. initialize the client components
// 3. start the application
// NOTE placeholder is replaced by webpack at build time to be the proper URL
http.getDataAsJSON({ url: 'API_CONFIG_URL' })
  .then(response => response.result)
  .then(config => Promise.all([
    init(route(''), mount(), mixin(), config),
    neighborhoods.init(route('neighborhoods'), mount(), mixin(), config),
    rodents.init(route('rodents'), mount(), mixin(), config),
    establishments.init(route('establishments'), mount(), mixin(), config)
  ]))
  .then(() => {
    // start listining to route changes
    riot.route.start(true)
  })

// mount once the document has loaded
window.onload = () => {
  riot.mount('*', { state: globalState })
}
