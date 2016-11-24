/**
 * @module redtail/modules/core/middleware/generateId
 */

import uuid from 'uuid'

/**
 * Generate a unique ID for this request, and set it on the request context as
 * `requestId`.
 *
 * Also sets the X-Request-Id header in the response.
 *
 * @returns {function} Middleware function.
 */
function generateId() {
  return (req, res, next) => {
    const requestId = uuid.v4()

    // store request id on the context for future reference
    req.ctx.requestId = requestId

    // include the request id in the response header
    res.set('X-Request-Id', requestId)

    next()
  }
}

export default generateId
