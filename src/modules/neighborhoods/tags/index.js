/**
 * @module redtail/modules/neighborhoods/tags
 */

import * as data from '../../data'
import * as utils from '../../utils'
import State from '../../core/models/state'

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
 * Update the application state with an API response.
 * @param {State} state The application state to update.
 * @param {string} path The path that updated the state.
 * @param {object} response The result of the API query.
 * @returns {State} The updated application state.
 */
function updateState(state = new State(), path = endpoint, response = {}) {
  state.result = response.result
  state.path = path
  state.links.update(response._links)
  return state
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
    Neighborhood.findAll()
      .then(utils.functions.partial(updateState, new State(), endpoint))
      .then((state) => {
        // use the HATEOAS links from the API to navigate pagination
        state.on('core.links.navigate', (toLink) => {
          const href = toLink.href
          Neighborhood.findAll({}, href)
            .then((utils.functions.partial(updateState, state, href)))
        })

        // user updated the filter conditions; requery the model
        state.on('core.filter.updated', () => {
          Neighborhood.findAll({
            offset: 0,
            order: state.getSort(),
            where: state.getFilter()
          }, state.path).then((utils.functions.partial(updateState, state, state.path)))
        })

        // user updated the sort conditions; requery the model
        state.on('core.sort.updated', () => {
          Neighborhood.findAll({
            order: state.getSort(),
            where: state.getFilter()
          }, state.path).then((utils.functions.partial(updateState, state, state.path)))
        })

        mount(tags.list, state)
      })
  })
}

export { init, tags }
