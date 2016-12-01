/**
 * @module redtail/modules/filter/loadSort
 */

import Validator, { ValidationError } from '../validator'

/**
 * The legal values for the order parameter, indicating the direction that
 * results are to be sorted in.
 * @type {array}
 */
const LEGAL_ORDER = ['asc', 'desc']

/**
 * Load the sort parameters into the request context.
 * Sorting includes the field to be sorted, and the order of the sort
 * (either ASC or DESC).
 *
 * Triggers the error handler if the sort parameters are invalid.
 *
 * @param {array} fields The fields that are allowed to be sorted on.
 * @param {string} defaultOrder The default direction that results should be
 *  sorted in, if an order isn't provided.
 * @returns {function} Middleware function.
 */
function loadSort(fields = [], defaultField = null, defaultOrder = LEGAL_ORDER[0]) {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'loadSort' })
    const sortParam = req.query.sort || null
    const sorts = Array.isArray(sortParam) ? sortParam : [sortParam]

    if (logger.debug()) {
      logger.debug({ sort: sorts }, 'generating sort filters')
    }

    const errors = sorts.reduce((last, sort) => {
      if (!sort) {
        return last
      }

      const parts = sort.split(',')

      try {
        const field = (new Validator(parts[0], 'field')).isOneOf(fields).get()
        const order = (new Validator(parts.length > 1 ? parts[1].toLowerCase() : defaultOrder, 'order'))
          .isOneOf(LEGAL_ORDER).get()

        if (logger.info()) {
          logger.info({ sort_field: field, sort_order: order },
            'adding sort on field: %s, %s', field, order)
        }

        req.ctx.sort.addSort(field, order)
      } catch (err) {
        if (err instanceof ValidationError) {
          return last.concat(err)
        } else if (logger.warn()) {
          logger.warn({ err }, 'unexpected error parsing sort: %s', err.message)
        }
      }

      return last
    }, [])

    if (errors.length) {
      req.ctx.status = 400
      next(errors)
    }

    if (defaultField) {
      req.ctx.sort.addSort(defaultField, defaultOrder)
    }

    return next()
  }
}

export default loadSort
