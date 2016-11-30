/**
 * @module redtail/modules/filter/middleware/loadEqual
 */

/**
 * Load a database filter into the request context, which checks that a
 * query parameter equals a database field value.
 * @param {string} field The name of the database field.
 * @param {string} param The name of the query parameter to pull the input
 *  value from; defaults to the same as the `field` parameter.
 * @returns {function} Middleware function.
 */
function loadEqual(field, param = field) {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'loadEqual' })
    const value = req.query[param] ? req.query[param] : null

    if (value) {
      if (logger.info()) {
        logger.info({
          match_field: field,
          match_param: param,
          match_value: value
        }, 'adding where condition for field %s', field)
      }

      req.ctx.filter.addWhere({ [field]: value })
    } else if (logger.debug()) {
      logger.debug({ match_field: field, match_param: param },
        'no equal value for field %s', field)
    }

    next()
  }
}

export default loadEqual
