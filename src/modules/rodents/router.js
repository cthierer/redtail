/**
 * @module redtail/modules/neighborhoods/router
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
    filter.middleware.loadPaging(),
    filter.middleware.loadSort(['created_at']),
    filter.middleware.loadEqual('neighborhood_id', 'neighborhood'),
    core.middleware.list(models.Rodent),
    core.middleware.count(models.Rodent),
    filter.middleware.setPagingLinks()
  )

  return router
}

export default init
