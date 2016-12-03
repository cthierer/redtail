/**
 * @module redtail/modules/core/middleware/create
 */

/**
 * Create and save a new instance of a model. Loads the saved instance, and
 * sets the status code to 201 Created.
 *
 * The instance values are pulled from the request body, which should have
 * been parsed higher up in the middleware chain.
 *
 * @param {Model} model The data model to count.
 * @returns {function} Middleware function.
 */
function create(model) {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'create', model_name: model.modelName })
    const data = req.body

    if (logger.info()) {
      logger.info({ data }, 'creating a new model instance from request body')
    }

    model.create(data)
      .then(instance => instance.get())
      .then((result) => {
        if (logger.info()) {
          logger.info({ instance_id: result.id }, 'successfully created new model instance')
        }

        req.ctx.status = 201
        req.ctx.result = result
        next()
      })
      .catch(next)
  }
}

export default create
