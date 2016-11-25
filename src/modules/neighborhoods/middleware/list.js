/**
 * @module redtail/modules/neighborhoods/middleware/list
 */

/**
 * List the model instances that match the provided filter from the request
 * context (`req.ctx.filter`).
 * @param {Model} model The database model to query.
 * @returns {function} Middleware function.
 * @todo Move this into a core module.
 */
function list(model) {
  return (req, res, next) => {
    model.findAll(req.ctx.getQueryOptions())
      .then(instances => instances.map(instance => instance.get()))
      .then((results) => {
        req.ctx.status = 200
        req.ctx.result = results
        next()
      })
  }
}

export default list
