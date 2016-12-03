/**
 * @module redtail/modules/core/middleware/count
 */

/**
 * Count the number of model instances in the database that match the
 * filter in the request context (`req.ctx.filter`). Sets the `count` property
 * of the request context (`req.ctx.count`).
 * @param {Model} model The data model to count.
 * @returns {function} Middleware function.
 */
function count(model) {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'count', model_name: model.modelName })
    const filter = req.ctx.getFilter()

    if (logger.debug()) {
      logger.debug({ filter }, 'preparing to count number of instances')
    }

    model.count(filter)
      .then((total) => {
        if (logger.debug()) {
          logger.debug({ total }, 'counted %s instances', total)
        }

        req.ctx.count = total
        next()
      })
      .catch(next)
  }
}

export default count
