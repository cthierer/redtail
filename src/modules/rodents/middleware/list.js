/**
 * @module redtail/modules/rodents/middleware/list
 */

/**
 * List the model instances that match the provided filter from the request
 * context (`req.ctx.filter`).
 * @param {Model} model The database model to query.
 * @returns {function} Middleware function.
 * @todo Move this into a core module.
 */
function list(rodentModel, statusModel, sourceModel, agencyModel) {
  return (req, res, next) => {
    rodentModel.findAll(Object.assign({}, req.ctx.getQueryOptions(), {
      include: [statusModel, sourceModel, agencyModel]
    }))
      .then(instances => instances.map((instance) => {
        const data = instance.toJSON()
        return Object.keys(data).reduce((result, attr) =>
          Object.assign(result, { [attr.toLowerCase()]: data[attr] }), {})
      }))
      .then((results) => {
        req.ctx.status = 200
        req.ctx.result = results
        next()
      })
  }
}

export default list
