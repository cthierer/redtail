/**
 * Entry point for the server component.
 * @module redtail/server
 */

import url from 'url'
import express from 'express'
import config from 'config'
import models, { sequelize } from './modules/models'
import * as Logger from './modules/logger'
import * as core from './modules/core'
import * as neighborhoods from './modules/neighborhoods'
import * as rodents from './modules/rodents'

/**
 * The port that the server should be started on. Loaded from the configuration
 * file at `redtail.api_base.port`, which can be set either in the
 * configuration file, or using the `PORT` environment variable.
 * @type {number}
 */
const port = parseInt(config.get('redtail.api_base.port'))

/**
 * An instance of the logger for server instantiation.
 * @type {Logger}
 */
const logger = Logger.get('server')

/**
 * The initialized and configured Express application.
 * @see http://expressjs.com/en/4x/api.html#express
 * @see http://expressjs.com/en/4x/api.html#app
 * @type {object}
 */
const app = express()

const paths = config.get('redtail.paths')

app.use(
  core.middleware.initContext(),  // initialize req.ctx
  core.middleware.generateId(),   // initilaize req.ctx.requestId
  core.middleware.initLogger()    // initialize req.ctx.logger
)

// serve the client application files
app.use(express.static('dist'))

// serve documentation and coverage reports
app.use('/docs', express.static('doc'))
app.use('/coverage', express.static('coverage/lcov-report'))

// serve client configuration
app.use(paths.config, (req, res, next) => {
  const redtailConfig = config.get('redtail')

  // explicitly building the config here just to make sure no secrets
  // are accidentally passed to the client
  req.ctx.result = {
    api_base: url.format(redtailConfig.api_base),
    endpoints: redtailConfig.paths
  }

  next()
})

// mount the sub applications
app.use(paths.neighborhoods, neighborhoods.router(models, sequelize))
app.use(paths.rodents, rodents.router(models, sequelize))

app.use(
  core.middleware.sendResult(),     // send the result to the client
  core.middleware.handleError(),    // handle any errors
  core.middleware.recordResponse()  // log the result of each request
)

export default app
export { port, logger }
