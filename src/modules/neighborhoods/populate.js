/**
 * @module redtail/modules/neighborhoods/populate
 */

import Config from 'config'
import * as transformer from '../transformer'
import * as http from '../data/http'

/**
 * The configuration object used to retrieve data from the remote source
 * and transform it into application model.
 *
 * Expected to have two attributes:
 *  - `remote`: defines how to query the remote endpoint; should match the
 *    format of the popsicle module request options.
 *  - `mapping`: defines how to map the remote model to an application model;
 *    follows the mapping definition defined for the {@link transform} function.
 *
 * Loaded from the 'neighborhoods.populate' configuration object.
 *
 * @type {Object}
 * @see https://github.com/blakeembrey/popsicle#handling-requests
 */
const config = Object.assign({
  remote: {},
  mapping: {}
}, Config.get('neighborhoods.populate'))

/**
 * Populate the database with neighborhood data retrieved from a remote data
 * source.
 *
 * The remote data source is defined in the configuration file under the
 * `neighborhoods.populate.remote` configuration key, and should match the
 * options object expected by the popsicle plugin. Objects from the remote
 * data source are transformed into Neighborhood model instances using the
 * mapping defined in the `neighborhodds.populate.mapping` configuration key.
 * The mapping should match the mapping object defined in the {@link transform}
 * function.
 *
 * After transforming the data, they are loaded as model instances and saved.
 *
 * @param {Object[]} models The collection of data models. Each model should
 *  match the interface exposed by the sequelize module's Model. Models should
 *  be keyed in this parameter by the upper-case, singular form of their name.
 *  If a required model is not included, then this function will do nothing
 *  and return an empty array.
 * @returns {Object[]} The collection of model instances for the data retrieved
 *  from the remote source.
 * @see https://github.com/blakeembrey/popsicle#handling-requests
 * @see http://docs.sequelizejs.com/en/v3/api/model/
 * @see http://docs.sequelizejs.com/en/v3/api/instance/
 */
async function populate(models) {
  if (!models || !models.Neighborhood) {
    return []
  }

  const Neighborhood = models.Neighborhood
  const raw = await http.getDataAsJSON(config.remote)
  const datas = await transformer.transformAll(raw, config.mapping)

  return Promise.all(datas.map(data => Neighborhood.build(data).save()))
}

export default populate
