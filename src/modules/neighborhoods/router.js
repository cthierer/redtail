/**
 * @module redtail/modules/neighborhoods/router
 */

import express from 'express'
import * as middleware from './middleware'
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
    filter.middleware.loadSort(['name', 'area']),
    filter.middleware.loadMatch('name', 'search', false),
    middleware.list(models.Neighborhood),
    middleware.count(models.Neighborhood),
    filter.middleware.setPagingLinks()
  )

  router.get('/reports',
    filter.middleware.loadPaging(),
    filter.middleware.loadSort(['name', 'area', 'num_rodents', 'num_establishments']),
    filter.middleware.loadMatch('name', 'search', false),
    middleware.listReports(models.Neighborhood, sequelize),
    middleware.count(models.Neighborhood),
    filter.middleware.setPagingLinks()
  )

  return router
}

export default init
