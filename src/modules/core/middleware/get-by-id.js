/**
 * @module redtail/modules/core/middleware/getById
 */

/**
 * List the model instances that match the provided filter from the request
 * context (`req.ctx.filter`).
 * @param {Model} model The database model to query.
 * @returns {function} Middleware function.
 * @todo ID parameter should be loaded into state by another middleware.
 */
function getById(model) {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'getById', model_name: model.modelName })
    const id = req.params.id

    if (logger.debug()) {
      logger.debug({ instance_id: id }, 'looking up instance by id:', id)
    }

    model.findById(id)
      .then(instance => instance.get())
      .then((result) => {
        if (logger.debug()) {
          logger.debug({ instance_id: id }, 'found matching instance')
        }

        req.ctx.status = 200
        req.ctx.result = result
        next()
      })
      .catch(next)
  }
}

export default getById
