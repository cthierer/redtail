/**
 * Entry point for the server component.
 * @module redtail/server
 */

import url from 'url'
import express from 'express'
import config from 'config'
import bodyParser from 'body-parser'
import cors from 'cors'
import compression from 'compression'
import models, { sequelize } from './modules/models'
import * as Logger from './modules/logger'
import * as geocoder from './modules/geocoder'
import * as core from './modules/core'
import * as neighborhoods from './modules/neighborhoods'
import * as rodents from './modules/rodents'
import * as establishments from './modules/establishments'
import * as agencies from './modules/agencies'
import * as sources from './modules/sources'
import * as statuses from './modules/statuses'
import loadProfiler, { requestTime, requestMemory } from './modules/profiler'

// load application profilers
// this must be done before the application is instantiated
loadProfiler([requestTime(), requestMemory()])

/**
 * The port that the server should be started on. Loaded from the configuration
 * file at `redtail.api_base.port`, which can be set either in the
 * configuration file. The service starting this server may chose to ignore
 * this configuration value.
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

/**
 * The application top-level paths, from the configuration.
 * @type {object}
 */
const paths = config.get('redtail.paths')

// global middleware
app.use(
  compression(),                  // enable gzip compression
  bodyParser.json(),              // parse body as JSON
  core.middleware.initContext(),  // initialize req.ctx
  core.middleware.generateId(),   // initilaize req.ctx.requestId
  core.middleware.initLogger()    // initialize req.ctx.logger
)

// enable CORS, if allowed by configuration
if (config.get('redtail.cors.enabled')) {
  const corsMiddleware = cors({ exposedHeaders: ['X-Request-Id', 'X-Instr-Tag'] })
  app.use(corsMiddleware)
  app.options('*', corsMiddleware)
}

// serve the client application files
app.use(express.static('dist'))

// serve documentation and coverage reports
app.use('/docs', express.static('doc'))
app.use('/coverage', express.static('coverage/lcov-report'))

// serve client configuration
// TODO load as middleware
app.use(paths.config, (req, res, next) => {
  const redtailConfig = config.get('redtail')
  const geocoderConfig = config.get('geocoder')

  // explicitly building the config here just to make sure no secrets
  // are accidentally passed to the client
  req.ctx.result = {
    api_base: url.format(redtailConfig.api_base),
    endpoints: redtailConfig.paths,
    map: redtailConfig.map,
    geocoder: geocoderConfig
  }

  next()
})

// mount the sub applications
app.use(paths.geocodes, geocoder.router())
app.use(paths.neighborhoods, neighborhoods.router(models, sequelize))
app.use(paths.rodents, rodents.router(models, sequelize))
app.use(paths.establishments, establishments.router(models, sequelize))
app.use(paths.agencies, agencies.router(models, sequelize))
app.use(paths.sources, sources.router(models, sequelize))
app.use(paths.statuses, statuses.router(models, sequelize))

// global middleware at the tail end of the chain
app.use(
  core.middleware.sendResult(),     // send the result to the client
  core.middleware.handleError(),    // handle any errors
  core.middleware.recordResponse()  // log the result of each request
)

export default app
export { port, logger }
