/**
 * @module redtail/modules/data/restModel
 */

import * as http from './http'
import * as utils from '../utils'

/**
 * The identifier for the "limit" parameter in the querystring.
 * @type {string}
 */
const LIMIT = 'limit'

/**
 * The identifier for the "offset" parameter in the querystring.
 * @type {string}
 */
const OFFSET = 'offset'

/**
 * The identifier for the "sort" parameter in the querystring.
 * @type {string}
 */
const SORT = 'sort'

/**
 * Model definition for interacting with data over a RESTful HTTP interface.
 * Intended to be interchangeable with the Sequelize Model class.
 * @class
 */
class RESTModel {
  /**
   * @constructor
   * @param {string} baseUrl The base URL to the remote service.
   * @param {string} endpoint The path to the model-specific endpoint.
   */
  constructor(baseUrl, endpoint) {
    /**
     * The base URL to the remote servce.
     * @type {string}
     */
    this.baseUrl = baseUrl

    /**
     * The path to the model-specific endpoint.
     * @type {string}
     */
    this.endpoint = endpoint

    /**
     * The full URL to the endpoint.
     * @type {string}
     */
    this.url = utils.urls.join(this.baseUrl, this.endpoint)
  }

  /**
   * Find all data matching the defined conditions.
   * @param {object} options
   * @param {object} options.where Limit results to only those results that
   *  match these conditions.
   * @param {integer} options.limit The maximum number of results to return.
   * @param {integer} options.offset The offset index to start at.
   * @param {array} options.order An array of `field,direction` strings
   *  describing which fields to order by, and in which direction.
   * @returns {Promise} Resolves to the result of the data call.
   * @todo Format response to be more Sequelize-like.
   */
  findAll(options = {}) {
    const url = this.url
    const query = Object.assign({}, options.where || {})

    if (options.limit !== undefined) {
      query[LIMIT] = options.limit
    }

    if (options.offset !== undefined) {
      query[OFFSET] = options.offset
    }

    if (options.order !== undefined) {
      query[SORT] = options.order.map(parts => `${parts[0]},${parts[1]}`)
    }

    return http.getDataAsJSON({ url, query })
  }

  findById(id) {
    const url = utils.urls.join(this.url, id)
    return http.getDataAsJSON({ url })
  }

  save(data) {
    const url = this.url

    if (data.id) {
      return http.putDataAsJSON(data, { url: utils.urls.join(url, data.id) })
    }

    return http.postDataAsJSON(data, { url })
  }

  remove(id) {
    const url = utils.urls.join(this.url, id)
    return http.deleteData({ url })
  }
}

export default RESTModel
export { LIMIT, OFFSET, SORT }
