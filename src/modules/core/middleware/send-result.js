/**
 * @module redtail/modules/core/middleware/sendResult
 */

/**
 * Send the response to the client, based on the generated request context.
 * This should be fired after all other middleware.
 *
 * The response status is set by the context's status code, and the body is
 * set by the context's body.
 *
 * @returns {function} Middleware function.
 */
function sendResult() {
  return (req, res, next) => {
    const body = req.ctx.responseBody

    if (body) {
      // status should be 200, unless it was forcefully set by something else
      const status = req.ctx.statusSet ? req.ctx.status : 200
      res.status(status).send(body)
    } else {
      res.status(req.ctx.status)
    }

    next()
  }
}

export default sendResult
