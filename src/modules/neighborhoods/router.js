/**
 * @module redtail/modules/neighborhoods/router
 */

import express from 'express'
import * as middleware from './middleware'
import * as core from '../core'
import * as filter from '../filter'

/**
 * @param {object} models
 * @returns {Router}
 * @see http://expressjs.com/en/4x/api.html#express.router
 */
function init(models, sequelize) {
  const router = express.Router()

  router.get('/',
    filter.middleware.loadPaging(),
    filter.middleware.loadSort(['name', 'area'], 'name'),
    filter.middleware.loadMatch('name', 'search', false),
    core.middleware.list(models.Neighborhood),
    core.middleware.count(models.Neighborhood),
    filter.middleware.setPagingLinks()
  )

  router.get('/reports',
    filter.middleware.loadPaging(),
    filter.middleware.loadSort(['name', 'area', 'num_rodents', 'num_establishments'], 'name'),
    filter.middleware.loadMatch('name', 'search', false),
    middleware.listReports(models.Neighborhood, sequelize),
    core.middleware.count(models.Neighborhood),
    filter.middleware.setPagingLinks()
  )

  return router
}

export default init
