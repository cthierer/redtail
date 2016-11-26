/**
 * @module redtail/modules/neighborhoods/tags
 */

import * as actions from '../actions'
import * as data from '../../data'

/**
 * The base endpoint for neighborhoods.
 * @type {string}
 * @todo Pull endpoint from configuration.
 */
const endpoint = '/neighborhoods'

/**
 * Mapping of identifiers to Riot tags mountable by this module.
 * @type {object}
 */
const tags = {
  listItem: 'neighborhoods-list-item',
  list: 'neighborhoods-list'
}

/**
 * The data model for interacting with Neighborhoods through a RESTful API.
 * @type {RESTModel}
 * @todo Pull baseUrl from configuration.
 */
const Neighborhood = new data.RESTModel('http://localhost:3000/', endpoint)

/**
 * Perform necessary initialization to load tags into the application.
 * @param {function} route Router function, used to match routes and fire
 *  actions. Matches the API exposed by Riot.
 * @param {function} mount A function that will mount a tag in the application.
 *  Called with the tag name (string), and an object with data to pass in as
 *  options when mounting.
 * @param {function} mixin A function that loads a mixin into the application
 *  context. Follows the same conventions as Riot mixins.
 * @see http://riotjs.com/api/route/
 * @see http://riotjs.com/api/#mixins
 */
function init(route, mount, mixin) {
  route('/', () => {
    mount(tags.list)
  })

  mixin('neighborhoods', {
    loadAll: actions.loadAll(Neighborhood)
  })
}

export { init, tags }
