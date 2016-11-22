/**
 * Entry point for the server component.
 * @module redtail/server
 */

import express from 'express'
import helloWorld from './modules/hello-world'

/**
 * The initialized and configured Express application.
 * @see http://expressjs.com/en/4x/api.html#express
 * @see http://expressjs.com/en/4x/api.html#app
 * @type {object}
 */
const app = express()

// serve the client application files
app.use(express.static('dist'))

// serve documentation and coverage reports
app.use('/docs', express.static('doc'))
app.use('/coverage', express.static('coverage/lcov-report'))

// serve a custom application endpoint
app.get('/message', (req, res, next) => {
  helloWorld.getMessage()
    .then((message) => {
      res.send(message)
      next()
    })
})

export default app
