/**
 * @module redtail/modules/filter/middlware/loadPaging
 */

import url from 'url'
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
 * Calculate the offset value to get the "previous" page of results.
 * @param {integer} offset The current offset.
 * @param {integer} limit The maximum number of results allowed.
 * @returns {object} The previous offset parameter value, or 0.
 */
function getPrevOffset(offset, limit) {
  if (offset > 0) {
    const diff = offset - limit
    const previous = diff >= 0 ? diff : 0
    return { previous }
  }
  return {}
}

/**
 * Calculate the offset value to get the "next" page of results.
 * @param {integer} offset The current offset.
 * @param {integer} limit The maximum number of results allowed.
 * @returns {object} The next offset parameter value.
 */
function getNextOffset(offset, limit) {
  const next = offset + limit
  return { next }
}

/**
 * Calculate the offset values to link to neighboring pages.
 *
 * Triggers the error handler if either limit or offset value is invalid.
 *
 * @param {integer} offset The current offset.
 * @param {integer} limit The maximum number of results allowed.
 * @returns {object} Mapping of link identifiers to offset values.
 */
function generateOffsets(offset, limit) {
  return Object.assign({}, getPrevOffset(offset, limit), getNextOffset(offset, limit))
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
  // validate the paging parameters, and set them on the context
  const setPaging = (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'loadPaging' })

    try {
      const limit = parseLimit(req.query[paramLimit] || defaultLimit, paramLimit)
      const offset = parseOffset(req.query[paramOffset] || DEFAULT_OFFSET, paramOffset)

      if (logger.info()) {
        logger.info({ limit, offset }, 'setting result offset %s, limit %s', offset, limit)
      }

      req.ctx.limit = limit
      req.ctx.offset = offset
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

  // generate the HATEOAS links for paging through results
  // uses the paging parameters generated in setPaging; assumed to be valid
  const setLinks = (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'loadPaging' })
    const limit = req.ctx.limit
    const offset = req.ctx.offset

    if (typeof limit === 'number' && typeof offset === 'number') {
      const offsetValues = generateOffsets(offset, limit)
      const pathname = url.parse(req.originalUrl).pathname

      Object.keys(offsetValues).forEach((key) => {
        const value = offsetValues[key]

        if (logger.debug()) {
          logger.debug({ hateoas_key: key, hateoas_offset: value },
            'calculated offset for "%s" link: %s', key, value)
        }

        req.ctx.addLink(key, url.format({
          pathname,
          query: Object.assign({}, req.query, { offset: value })
        }))
      })
    }

    next()
  }

  // composite middleware - run multiple functions
  return [setPaging, setLinks]
}

export default loadPaging
