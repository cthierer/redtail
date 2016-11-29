/**
 * @module redtail/modules/rodents/populate
 */

import Config from 'config'
import { populate } from '../core/populate'

/**
 * Populate the database with rodent data retrieved from a remote data source.
 *
 * The data source and mapping configuration is defined in the application
 * configuration under the `rodents.populate` key.
 *
 * @param {Object[]} models The collection of data models.
 * @returns {Object[]} The collection of saved Rodent instances.
 */
async function populateRodents(models) {
  const config = Object.assign({
    remote: {},
    mapping: {}
  }, Config.get('rodents.populate'))

  return populate(config, models.Rodent, models)
}

export default populateRodents
