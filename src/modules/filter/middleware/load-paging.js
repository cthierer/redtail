/**
 * @module redtail/modules/filter/middlware/loadPaging
 */

import Validator, { ValidationError } from '../validator'

/**
 * The default offset to start with, if no offset is specified in the request.
 * @type {integer}
 */
const DEFAULT_OFFSET = 0

/**
 * Parse and validate the string provided as a valid limit. The limit must
 * be a non-zero, positive integer.
 * @param {string} limitStr The raw limit value.
 * @param {string} field The name of the limit field in the querystring.
 * @returns {integer} The parsed value, if valid.
 * @throws {ValidationError} Thrown if the value is not valid.
 */
function parseLimit(limitStr, field) {
  return (new Validator(Number.parseInt(limitStr), field))
    .isNumber()
    .isPositive()
    .get()
}

/**
 * Parse and validate the string provided as a valid offset. The offset must
 * be a positive integer, or zero.
 * @param {string} offsetStr The raw offset value.
 * @param {string} field The name of the limit offset field in the querystring.
 * @returns {integer} The parsed value, if value.
 * @throws {ValidationError} Thrown if the value is not valid.
 */
function parseOffset(offsetStr, field) {
  return (new Validator(Number.parseInt(offsetStr), field))
    .isNumber()
    .isPositiveOrZero()
    .get()
}

/**
 * Load the paging parameters from the request into the database filter.
 * @param {integer} defaultLimit The default limit parameter, if none is
 *  specified in the request; defaults to 10. Must be a positive, non-zero
 *  integer.
 * @param {string} paramLimit The query string parameter specifying the limit;
 *  defults to "limit".
 * @param {string} paramOffset The query string parameter specifying the
 *  offset; defaults to "offset".
 * @returns {function} Middleware function.
 */
function loadPaging(defaultLimit = 10, paramLimit = 'limit', paramOffset = 'offset') {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'loadPaging' })

    try {
      const limit = parseLimit(req.query[paramLimit] || defaultLimit, paramLimit)
      const offset = parseOffset(req.query[paramOffset] || DEFAULT_OFFSET, paramOffset)

      if (logger.info()) {
        logger.info({ limit, offset }, 'setting result offset %s, limit %s', offset, limit)
      }

      req.ctx.filter.limit = limit
      req.ctx.filter.offset = offset
    } catch (err) {
      if (logger.debug()) {
        logger.debug({ err }, 'unable to parse parameter: %s', err.message)
      }

      if (err instanceof ValidationError) {
        req.ctx.status = 400
      }

      return next(err)
    }

    return next()
  }
}

export default loadPaging
