/**
 * @module redtail/modules/agencies/router
 */

import express from 'express'
import * as core from '../core'
import * as filter from '../filter'

/**
 * @param {object} models
 * @returns {Router}
 * @see http://expressjs.com/en/4x/api.html#express.router
 */
function init(models) {
  const router = express.Router()

  router.get('/',
    filter.middleware.loadSort(['name'], 'name'),
    core.middleware.list(models.Agency)
  )

  return router
}

export default init
