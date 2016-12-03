/**
 * @module redtail/modules/rodents/tags
 */

import serialize from 'form-serialize'
import * as actions from '../../core/actions'
import * as data from '../../data'

/**
 * Mapping of identifiers to Riot tags mountable by this module.
 * @type {object}
 */
const tags = {
  createForm: 'rodents-form',
  editForm: 'rodents-form',
  mapDetails: 'rodents-map-details'
}

/**
 * Perform necessary initialization to load tags into the application.
 * @param {function} route Router function, used to match routes and fire
 *  actions. Matches the API exposed by Riot.
 * @param {function} mount A function that will mount a tag in the application.
 *  Called with the tag name (string), and an object with data to pass in as
 *  options when mounting.
 * @param {function} mixin A function that loads a mixin into the application
 *  context. Follows the same conventions as Riot mixins.
 * @param {object} config The configuration object for the application.
 * @see http://riotjs.com/api/route/
 * @see http://riotjs.com/api/#mixins
 */
async function init(route, mount, mixin, config) {
  const rodentModel = new data.RESTModel(config.api_base, config.endpoints.rodents, 'rodent report')
  const geocodes = new data.RESTModel(config.api_base, config.endpoints.geocodes)
  const neighborhoodsModel = new data.RESTModel(config.api_base, config.endpoints.neighborhoods)
  const agenciesModel = new data.RESTModel(config.api_base, config.endpoints.agencies)
  const sourcesModel = new data.RESTModel(config.api_base, config.endpoints.sources)
  const statusesModel = new data.RESTModel(config.api_base, config.endpoints.statuses)

  route('/create', () => {
    mount(tags.createForm)
  })

  route('/edit/*', (id) => {
    rodentModel.findById(id)
      .then((rodent) => {
        mount(tags.editForm, { rodent: rodent.result })
      })
  })

  mixin('rodents', {
    rodents: {
      loadAll: actions.loadAll(rodentModel),
      save: actions.saveData(rodentModel),
      remove: actions.remove(rodentModel),
      loadNeighborhoods: actions.loadAll(neighborhoodsModel, { order: ['name', 'asc'], limit: 500 }),
      loadAgencies: actions.loadAll(agenciesModel, { order: ['name', 'asc'] }),
      loadSources: actions.loadAll(sourcesModel, { order: ['title', 'asc'] }),
      loadStatuses: actions.loadAll(statusesModel, { order: ['title', 'asc'] }),
      geocode: address => geocodes.findAll({ where: address }).then(response => response.result),
      serialize
    }
  })
}

export { init, tags }
