/**
 * @module redtail/modules/rodents/populate
 */

import Config from 'config'
import Promise from 'bluebird'
import { populate } from '../core/populate'
import { geocode } from '../geocoder'
import * as Logger from '../logger'

const logger = Logger.get('rodents/populate')

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

  const instances = await populate(config, models.Rodent, models)

  return Promise.map(instances, async (instance) => {
    // manually geocode the retrieved data, and update the data in the database
    try {
      const geolocation = await geocode(instance.get(), Config.get('geocoder'))

      if (geolocation && geolocation.latitude && geolocation.longitude) {
        return instance.update(geolocation, { silent: true })
      }
    } catch (err) {
      // geocoding errors aren't fatal - just log for debugging
      if (logger.debug()) {
        logger.debug({ err, address: instance.get() },
          'problem geocoding address:', err.message)
      }
    }

    return instance
  })
}

export default populateRodents
