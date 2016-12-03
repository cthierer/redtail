/**
 * @module redtail/modules/core/middleware/update
 */

 /**
  * Update a new instance of a model. Loads the saved instance..
  *
  * The instance values are pulled from the request body, which should have
  * been parsed higher up in the middleware chain.
  *
  * @param {Model} model The data model to count.
  * @returns {function} Middleware function.
  * @todo ID parameter should be loaded into state by another middleware.
  */
function update(model) {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'update', model_name: model.modelName })
    const id = req.params.id
    const data = req.body

    if (logger.info()) {
      logger.info({ data, instance_id: id }, 'updating instance from request body')
    }

    model.update(data, { where: { id } })
      .then(() => {
        if (logger.info()) {
          logger.info({ instance_id: id }, 'update complete; getting updated instance')
        }
      })
      .then(() => model.findById(id))
      .then(instance => instance.get())
      .then((result) => {
        if (logger.info()) {
          logger.info({ instance_id: result.id }, 'retrieved updated instance; done!')
        }

        req.ctx.status = 200
        req.ctx.result = result
        next()
      })
      .catch(next)
  }
}

export default update
