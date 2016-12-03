
/**
 * @module redtail/modules/sources/router
 */

import express from 'express'
import { getCoordinates } from './middleware'

/**
 * @returns {Router}
 * @see http://expressjs.com/en/4x/api.html#express.router
 */
function init() {
  const router = express.Router()
  router.get('/', getCoordinates())
  return router
}

export default init
