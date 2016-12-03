/**
 * @module redtail/geocoder/middleware
 */

import Config from 'config'
import { geocode } from './index'
import { Validator } from '../filter'

/**
 * Lookup coordinates for a specified address, specified in the query parameters.
 * Expects query parameters to include street, state, city, zip.
 *
 * This acts as a simplified proxy to the geocoding service, to allow the
 * client to make geocoding requests and avoid about CORS failrues.
 *
 * All query parameters must be present; otherwise, this request will fail.
 *
 * @returns {function} Middleware function.
 */
function getCoordinates() {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'getCoordinates' })

    try {
      const street = new Validator(req.query.street, 'street').isNotEmpty().get()
      const city = new Validator(req.query.city, 'city').isNotEmpty().get()
      const state = new Validator(req.query.state, 'state').isNotEmpty().get()
      const zip = new Validator(req.query.zip, 'zip').isNotEmpty().get()
      const address = { street, city, state, zip }

      if (logger.debug()) {
        logger.debug({ address }, 'making geocoding request for address')
      }

      geocode(address, Config.get('geocoder'))
        .then((coordinates) => {
          if (logger.debug()) {
            logger.debug({ address, coordinates }, 'successfully geocoded address')
          }

          req.ctx.status = 200
          req.ctx.result = coordinates
          next()
        })
        .catch(next)
    } catch (e) {
      next(e)
    }
  }
}

export default { getCoordinates }
export { getCoordinates }
