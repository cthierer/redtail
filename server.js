/**
 * Start the application listening on a port, specified using the PORT
 * environment variable (defaults to port 3000).
 *
 * File will not be run through babel, so it must use standard Node 6 features.
 */

const app = require('./app/server').default

app.listen(process.env.PORT || 3000, () => {
  console.log('server started') // eslint-disable-line no-console
})
