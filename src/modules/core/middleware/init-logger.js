/**
 * @module redtail/modules/core/middleware/initLogger
 */

import * as Logger from '../../logger'

/**
 * Initialize a logger for this request. All logs written by this logger will
 * include the request ID from the request context.
 *
 * The logger is loaded to `req.ctx.logger` for use by middleware further down
 * the chain.
 *
 * @returns {function} Middleware function.
 * @todo Include a serialized request in the log.
 */
function initLogger() {
  // initialize a base logger based on the core module
  const baseLogger = Logger.get('core')

  return (req, res, next) => {
    // initialize a child logger that includes the request ID
    const logger = baseLogger.child({
      req_id: req.ctx.requestId
    })

    if (logger.info()) {
      logger.info({ method: req.method, path: req.path },
        'processing request: %s %s', req.method, req.path)
    }

    req.ctx.logger = logger

    next()
  }
}

export default initLogger
