/**
 * Entry point for the server component.
 * @module redtail/server
 */

import express from 'express'
import models from './modules/models'
import * as core from './modules/core'
import * as neighborhoods from './modules/neighborhoods'

/**
 * The initialized and configured Express application.
 * @see http://expressjs.com/en/4x/api.html#express
 * @see http://expressjs.com/en/4x/api.html#app
 * @type {object}
 */
const app = express()

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

app.use('/neighborhoods', neighborhoods.router(models))

app.use(
  core.middleware.sendResult(),     // send the result to the client
  core.middleware.handleError(),    // handle any errors
  core.middleware.recordResponse()  // log the result of each request
)

export default app
