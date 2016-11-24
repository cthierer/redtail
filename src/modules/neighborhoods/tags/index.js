
import * as http from '../../data/http'

/**
 * Mapping of identifiers to Riot tags mountable by this module.
 * @type {object}
 */
const tags = {
  listItem: 'neighborhoods-list-item',
  list: 'neighborhoods-list'
}

/**
 * Perform necessary initialization to load tags into the application.
 * @param {function} route Router function, used to match routes and fire
 *  actions. Matches the API exposed by Riot.
 * @param {function} mount A function that will mount a tag in the application.
 *  Called with the tag name (string), and an object with data to pass in as
 *  options when mounting.
 * @param {string} basePath The base path for all routes loaded by this
 *  module; defaults to "/".
 * @see http://riotjs.com/api/route/
 */
function init(route, mount, basePath = '/') {
  route(basePath, () => {
    http.getDataAsJSON({
      url: 'http://localhost:3000/neighborhoods'
    }).then((response) => {
      mount(tags.list, {
        neighborhoods: response.result
      })
    })
  })
}

export { init, tags }
