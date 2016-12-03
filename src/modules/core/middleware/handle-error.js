/**
 * @module redtail/modules/core/middleware/handleError
 */

/**
 * Handle an error by logging it, setting the appropriate status code, and
 * returning a sanitized error response.
 *
 * The status code will be set from request context status code, if that
 * status code has been _manually_ set, and if that status code is a request
 * error (400-class error). Otherwise, the status code will be a 500 error,
 * indicating a server error.
 *
 * The body of the response will be set to an error object including an error
 * code, message, and value (if this is a validation error), pulled from the
 * `err` parameter.
 *
 * @returns {function} Middleware function.
 * @todo Standardize the error object.
 */
function handleError() {
  return (err, req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'handleError' })
    const status = req.ctx.status
    const message = Array.isArray(err) ? err.map(error => error.message).join() : err.message
    let error = err

    if (status && status >= 400 && status < 500) {
      if (logger.info()) {
        logger.info({ err }, 'encountered a bad request: %s', message)
      }

      res.status(status)
    } else if (err && err.name && err.name === 'SequelizeValidationError') {
      if (logger.info()) {
        logger.info({ err }, 'encountered a validation error: %s', message)
      }

      error = err.errors

      res.status(400)
    } else {
      if (logger.error()) {
        logger.error({ err }, 'encountered an unexpected error: %s', message)
      }

      res.status(500)
    }

    // TODO consolidate into single flow
    if (Array.isArray(error)) {
      res.send(error.map(e => Object.assign({}, {
        message: e.message,
        code: e.code || e.type,
        value: e.value,
        field: e.field || e.path,
        request_id: req.ctx.requestId
      })))
    } else {
      res.send([{
        message,
        code: error.code,
        value: error.value,
        field: error.field,
        request_id: req.ctx.requestId
      }])
    }

    next()
  }
}

export default handleError
