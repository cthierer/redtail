/**
 * @module redtail/modules/neighborhoods/populate
 */

import Config from 'config'
import { populate } from '../core/populate'

/**
 * Populate the database with neighborhood data retrieved from a remote data
 * source.
 *
 * The data source and mapping configuration is defined in the application
 * configuration file under the `neighborhoods.populate` key.
 *
 * @param {Object[]} models The collection of data models.
 * @returns {Object[]} The collection of saved Neighborhood instances.
 */
async function populateNeighborhoods(models) {
  const config = Object.assign({
    remote: {},
    mapping: {}
  }, Config.get('neighborhoods.populate'))

  return populate(config, models.Neighborhood, models)
}

export default populateNeighborhoods
