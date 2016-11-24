/**
 * @module redtail/modules/core/middleware/recordResponse
 */

/**
 * Record the response in the application log.
 * @returns {function} Middleware function.
 * @todo Include a serialized response in the log.
 */
function recordResponse() {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'recordResponse' })

    if (logger.info()) {
      logger.info({ status: res.statusCode },
        'finished processing request, status: %s', res.statusCode)
    }

    next()
  }
}

export default recordResponse
