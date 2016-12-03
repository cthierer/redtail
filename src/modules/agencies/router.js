/**
 * @module redtail/modules/agencies/router
 */

import express from 'express'
import * as core from '../core'
import * as filter from '../filter'

/**
 * Initialize the Agency router.
 *
 * An Agency is a database entity that represents a government department.
 *
 * @param {object} models The initialized application models.
 * @returns {Router} Initialized router for this module.
 * @see http://expressjs.com/en/4x/api.html#express.router
 */
function init(models) {
  const router = express.Router()

  // lookup all agencies
  router.get('/',
    filter.middleware.loadSort(['name'], 'name'),
    core.middleware.list(models.Agency)
  )

  return router
}

export default init
