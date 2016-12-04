/**
 * @module redtail/modules/profiler
 */

import Router from 'express/lib/router'
import uuid from 'uuid'
import Profile from './profile'
import * as Logger from '../logger'
import requestMemory from './instrumenters/request-memory'
import requestTime from './instrumenters/request-time'
import { wrap } from './utils/functions'

/**
 * Hook into Express to fire instrumentation during a request chain.
 *
 * Wraps the Express Router's `handle` function, which is the entry point for
 * route handling when a request comes in - the middleware chain starts and
 * ends there.
 *
 * @param {array} loaded The loaded instrumenters to use.
 */
function load(loaded) {
  const logger = Logger.get('profiler')

  function triggerInstrumenters(_handle, req, res, out) {
    const tag = req.__tag || uuid.v4()
    const reqLogger = logger.child({ tag })
    const profile = new Profile()

    // wrap the next callback once the chain is done
    function next(...args) {
      /*
       * Print out the outcome to the log.
       * NOTE multiple profiles may be printed if there are sub-routers
       * mounted to the main application path
       */
      if (reqLogger.info()) {
        reqLogger.info({ profile: profile.data }, 'generated profile for request')
      }
      return out(...args)
    }

    // put a tag on the request to identify later
    req.__tag = tag

    // send back the header to trace back to the logs
    res.setHeader('X-Profile-Tag', tag)

    // fire the instrumenters for the request
    loaded.forEach(instrumenter => instrumenter(req, profile))

    return _handle.call(this, req, res, next)
  }

  wrap(Router, 'handle', triggerInstrumenters)

  if (logger.info()) {
    logger.info('loaded profiler')
  }
}

export default load
export { requestMemory, requestTime }
