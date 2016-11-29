/**
 * @module redtail/modules/geocoder
 */

import Config from 'config'
import { getDataAsJSON } from '../data/http'

/**
 * Geocode an address using the US Census Geocoder. The geocoding service
 * is configured in the configuration file under the `geocoder` key.
 * @param {object} address The address to geocode, incluidng the street,
 *  city, state, and Zip.
 * @returns {object} The result of geocoding, including a latitude and
 *  longitude attribute.
 * @see https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.pdf
 */
async function geocode(address) {
  const config = Config.get('geocoder')
  // build a query, mapping the address fields to the query parameter
  // using the config.params mapping object
  const query = Object.keys(config.params).reduce((options, field) => {
    const value = address[field]
    if (value) {
      // the address has a specified field, include it in the query
      const param = config.params[field]
      return Object.assign(options, { [param]: value })
    }
    // otherwise, no value for this field - just skip it
    return options
  }, Object.assign({}, config.remote.query))
  // get the result from the remote service
  const result = await getDataAsJSON(Object.assign({}, config.remote, { query }))

  if (result.result.addressMatches && result.result.addressMatches.length) {
    // match found - assume first match is the best match, return lat/long
    // TODO should do sanity check on match to make sure Zip, state matches
    const match = result.result.addressMatches[0]
    return { latitude: match.coordinates.x, longitude: match.coordinates.y }
  }

  return null
}

export default { geocode }
export { geocode }
