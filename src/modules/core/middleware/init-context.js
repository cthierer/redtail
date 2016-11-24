/**
 * @module redtail/modules/core/middleware/initContext
 */

import Context from '../models/context'

/**
 * Initialize a fresh request context. The request context encapsulates data
 * loaded by various middleware in order to generate a response. Middleware
 * should _only_ set values on the request context.
 *
 * The request context is loaded on `req.ctx`.
 *
 * @returns {function} Middleware function.
 * @see {Context}
 */
function initContext() {
  return (req, res, next) => {
    req.ctx = new Context()
    next()
  }
}

export default initContext
