/**
 * @module redtail/modules/core/middleware/getById
 */

/**
 * List the model instances that match the provided filter from the request
 * context (`req.ctx.filter`).
 * @param {Model} model The database model to query.
 * @returns {function} Middleware function.
 * @todo Move this into a core module.
 */
function getById(model) {
  return (req, res, next) => {
    model.findById(req.params.id)
      .then(instance => instance.get())
      .then((result) => {
        req.ctx.status = 200
        req.ctx.result = result
        next()
      })
  }
}

export default getById
