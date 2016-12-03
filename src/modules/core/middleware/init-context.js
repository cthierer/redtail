/**
 * @module redtail/modules/core/middleware/initContext
 */

import State from '../models/state'

/**
 * Initialize a fresh request context. The request context encapsulates data
 * loaded by various middleware in order to generate a response. Middleware
 * should _only_ set values on the request context.
 *
 * The request context is loaded on `req.state`.
 *
 * @returns {function} Middleware function.
 * @see {State}
 */
function initContext() {
  return (req, res, next) => {
    req.ctx = new State({ sort: { allowMultiple: true } })
    req.state = req.ctx
    next()
  }
}

export default initContext
