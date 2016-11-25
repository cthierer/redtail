/**
 * @module redtail/modules/neighborhoods/middleware/count
 */

/**
 * Count the number of model instances in the database that match the
 * filter in the request context (`req.ctx.filter`). Sets the `count` property
 * of the request context (`req.ctx.count`).
 * @param {Model} model The data model to count.
 * @returns {function} Middleware function.
 * @todo Move this into a core module.
 */
function count(model) {
  return (req, res, next) => {
    model.count(req.ctx.getFilter())
      .then((total) => {
        req.ctx.count = total
        next()
      })
  }
}

export default count
