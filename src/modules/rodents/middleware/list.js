/**
 * @module redtail/modules/rodents/middleware/list
 */

/**
 * List the Rodent instances that match the provided filter from the request
 * context (`req.ctx.filter`). Includes related Status, Source, and Agency
 * data.
 * @param {Model} rodentModel The rodent database model.
 * @param {Model} statusModel The status database model.
 * @param {Model} sourceModel The source database model.
 * @param {Model} agencyModel The agency database model.
 * @returns {function} Middleware function.
 * @todo Find more generic way to load associations.
 */
function list(rodentModel, statusModel, sourceModel, agencyModel) {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'list', model_name: 'Rodent' })
    const filter = req.ctx.getQueryOptions()
    const include = [statusModel, sourceModel, agencyModel]

    if (logger.debug()) {
      logger.debug({ filter }, 'listing rodents matching filter')
    }

    rodentModel.findAll(Object.assign({}, filter, { include }))
      .then(instances => instances.map((instance) => {
        const data = instance.toJSON()
        // TODO find more generic way to standardize response data to be lowercase
        return Object.keys(data).reduce((result, attr) =>
          Object.assign(result, { [attr.toLowerCase()]: data[attr] }), {})
      }))
      .then((results) => {
        if (logger.debug()) {
          logger.debug({ count: results.length }, 'found %s results matching the filter',
            results.length)
        }

        req.ctx.status = 200
        req.ctx.result = results
        next()
      })
  }
}

export default list
