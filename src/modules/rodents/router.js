/**
 * @module redtail/modules/rodents/router
 */

import express from 'express'
import * as core from '../core'
import * as filter from '../filter'
import list from './middleware/list'

/**
 * @param {object} models
 * @returns {Router}
 * @see http://expressjs.com/en/4x/api.html#express.router
 */
function init(models) {
  const router = express.Router()

  router.get('/',
    filter.middleware.loadPaging(),
    filter.middleware.loadSort(['created_at'], 'created_at'),
    filter.middleware.loadEqual('neighborhood_id', 'neighborhood'),
    list(models.Rodent, models.Status, models.Source, models.Agency),
    core.middleware.count(models.Rodent),
    filter.middleware.setPagingLinks()
  )

  router.post('/',
    core.middleware.create(models.Rodent)
  )

  router.get('/:id',
    core.middleware.getById(models.Rodent)
  )

  router.put('/:id',
    core.middleware.update(models.Rodent)
  )

  router.delete('/:id',
    core.middleware.remove(models.Rodent)
  )

  return router
}

export default init
