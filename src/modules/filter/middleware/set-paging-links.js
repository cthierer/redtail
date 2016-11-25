
import url from 'url'

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
 * @param {integer} total The total number of results that can be paged through.
 * @returns {object} The next offset parameter value.
 */
function getNextOffset(offset, limit, total) {
  const next = offset + limit
  if (typeof total === 'number' && next < total) {
    return { next }
  }
  return {}
}

/**
 * Calculate the offset values to link to neighboring pages.
 *
 * Triggers the error handler if either limit or offset value is invalid.
 *
 * @param {integer} offset The current offset.
 * @param {integer} limit The maximum number of results allowed.
 * @param {integer} total The total number of results that can be paged through.
 * @returns {object} Mapping of link identifiers to offset values.
 */
function generateOffsets(offset, limit, total) {
  return Object.assign({},
    getPrevOffset(offset, limit),
    getNextOffset(offset, limit, total))
}

/**
 * Set the HATEOAS links for navigating through pages. Generates links for
 * "previous" and "next". The previous link will only be generated if there
 * is a previous page. The next link will only be generated if there is a
 * next page, based on the total number of results loaded in the context
 * (checking the req.ctx.count value). If no value is set, then the "next" link
 * will always be generated.
 * @returns {function} Middleware function.
 */
function setPagingLinks() {
  return (req, res, next) => {
    const logger = req.ctx.logger.child({ middleware: 'setPagingLinks' })
    const limit = req.ctx.limit
    const total = req.ctx.count
    const offset = req.ctx.offset

    if (typeof limit === 'number' && typeof offset === 'number') {
      const offsetValues = generateOffsets(offset, limit, total)
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
}

export default setPagingLinks
