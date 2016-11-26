/**
 * @module redtail/modules/core/utils/state
 */

import querystring from 'querystring'
import * as utils from '../../utils'
import { OFFSET as QUERY_OFFSET, LIMIT as QUERY_LIMIT, SORT } from '../../data/rest-model'
import { OFFSET as FILTER_OFFSET, LIMIT as FILTER_LIMIT, WHERE } from '../models/filter'
import { ASC } from '../models/sort'

/**
 * Generate a filter from a query object. Converts the parameters from the
 * querystring to the appropriate values in the state Filter object.
 * @param {string} query The query object, mapping query string keys to values.
 * @returns {object} The data object to filter, which can be loaded into a
 *  Filter instance using Filter.update.
 * @see {Filter#update}
 */
function getFilterFromQuery(query) {
  if (!query) {
    return {}
  }

  return Object.keys(query).reduce((filter, key) => {
    if (key === SORT) {
      // ignores sort, that's handled elsewhere
      return filter
    }

    const value = query[key]

    if (key === QUERY_OFFSET) {
      // map the offset from the query to the offset value in the filter
      return Object.assign(filter, { [FILTER_OFFSET]: value })
    } else if (key === QUERY_LIMIT) {
      // map the limit from the query to the limit in the filter
      return Object.assign(filter, { [FILTER_LIMIT]: value })
    }

    // for all other parameters, consider it a where condition
    // merge into the existing where conditions
    return utils.objects.merge(filter, { [WHERE]: { [key]: value } })
  }, {})
}

/**
 * Generate a sort data object from the querystring.
 * @param {string} query The query object, mapping query string keys to values.
 * @returns {object} The data object to sort with, which can be loaded into a
 *  Sort instance using Sort.update.
 * @see {Sort#update}
 */
function getSortFromQuery(query) {
  const param = query[SORT]

  if (!param) {
    return {}
  }

  // can have multiple sort parameters
  // in querystring, stored as "field,direction"
  const sortParam = Array.isArray(param) ? param : [param]

  return sortParam.reduce((sorts, value) => {
    // parse out the field and direction from the querystring
    const parts = value.split(',')
    const field = parts[0]
    const direction = parts.length > 1 ? parts[1] : ASC

    return Object.assign(sorts, { [field]: direction })
  }, {})
}

/**
 * Update the application state to match the specified link. A link is an
 * object that matches the HATEOAS link specification, and at a minimum
 * includes an "href" attribute.
 * @param {object} link The link to update state state to match.
 * @param {State} state The state to load the link into.
 */
function loadLink(link, state) {
  const href = link.href

  // no querystring; done
  if (!href.includes('?')) {
    return
  }

  // parse out the querystring from the link
  const queryStr = href.substring(href.indexOf('?') + 1)
  const query = querystring.parse(queryStr)

  // update the filter and the sort based on the querystring from the link
  state.filter.update(getFilterFromQuery(query))
  state.sort.update(getSortFromQuery(query))

  // emit one event when everything is done
  state.queryUpdated()
}

export default { loadLink }
export { loadLink }
