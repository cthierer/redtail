/**
 * @module redtail/modules/core/middleware/list
 */

/**
 * List the model instances that match the provided filter from the request
 * context (`req.ctx.filter`).
 * @param {Model} model The database model to query.
 * @returns {function} Middleware function.
 */
function list(model) {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'list', model_name: model.modelName })
    const filter = req.ctx.getQueryOptions()

    if (logger.debug()) {
      logger.debug({ filter }, 'finding all instances that match the filter')
    }

    model.findAll(filter)
      .then(instances => instances.map(instance => instance.get()))
      .then((results) => {
        if (logger.debug()) {
          logger.debug({ count: results.length }, 'found %s results matching the filter',
            results.length)
        }

        req.ctx.status = 200
        req.ctx.result = results
        next()
      })
      .catch(next)
  }
}

export default list
