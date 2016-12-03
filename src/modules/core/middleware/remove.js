/**
 * @module redtail/modules/core/middleware/remove
 */

/**
 * Remvoe the entity specified by req.params.id from the database.
 * @param {Model} model The database model to query.
 * @returns {function} Middleware function.
 * @todo ID parameter should be loaded into state by another middleware.
 */
function remove(model) {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'remove', model_name: model.modelName })
    const id = req.params.id

    if (logger.info()) {
      logger.info({ instance_id: id }, 'deleting model instance with id:', id)
    }

    model.destroy({ where: { id } })
      .then(() => {
        if (logger.info()) {
          logger.info({ instance_id: id }, 'successfully deleted instance')
        }

        req.ctx.status = 202
        next()
      })
      .catch(next)
  }
}

export default remove
