
/**
 * @module redtail/modules/sources/router
 */

import express from 'express'
import middleware from './middleware'

/**
 * @param {object} models
 * @returns {Router}
 * @see http://expressjs.com/en/4x/api.html#express.router
 */
function init() {
  const router = express.Router()
  router.get('/', middleware())
  return router
}

export default init
