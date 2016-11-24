/**
 * @module redtail/modules/filter/middleware/loadMatch
 */

/**
 * Load a database filter into the request context, which checks that a
 * query parameter matches a database field value.
 * @param {string} field The name of the database field.
 * @param {string} param The name of the query parameter to pull the input
 *  value from; defaults to the same as the `field` parameter.
 * @param {boolean} exact If false, then do a wildecard match against database
 *  values for all values that _start with_ the query parameter. Otherwise,
 *  does an exact match (ignoring case). Defaults to `true`.
 * @returns {function} Middleware function.
 */
function loadMatch(field, param = field, exact = true) {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'loadMatch' })
    const value = req.query[param] ? req.query[param] : null

    if (value) {
      const match = exact
        ? { like: value }         // exact match, ignoring case
        : { like: `${value}%` }   // wildcard match

      if (logger.info()) {
        logger.info({
          match_field: field,
          match_param: param,
          match_value: match,
          match_exact: exact
        }, 'adding where condition for field %s', field)
      }

      req.ctx.addWhere({ [field]: match })
    } else if (logger.debug()) {
      logger.debug({ match_field: field, match_param: param },
        'no match value for field %s', field)
    }

    next()
  }
}

export default loadMatch
