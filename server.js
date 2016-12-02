/**
 * Start the application listening on a port, specified using the PORT
 * environment variable (defaults to port 3000).
 *
 * File will not be run through babel, so it must use standard Node 6 features.
 */

const redtail = require('./app')

const app = redtail.default
const port = app.port || process.env.PORT || 3000

app.server.listen(port, () => {
  app.logger.info('server started, listening on port %s', port)
})
