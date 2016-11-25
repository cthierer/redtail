/**
 * @module redtail/modules/data/restModel
 */

import * as http from './http'
import * as utils from '../utils'

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
   * @param {string} endpoint Override the default endpoint with a custom
   *  endpoint for this query; optional.
   * @returns {Promise} Resolves to the result of the data call.
   * @todo Format response to be more Sequelize-like.
   */
  findAll(options = {}, endpoint = this.endpoint) {
    const query = Object.assign({}, options.where || {})

    if (options.limit !== undefined) {
      query.limit = options.limit
    }

    if (options.offset !== undefined) {
      query.offset = options.offset
    }

    if (options.order !== undefined) {
      query.sort = options.order.map(parts => `${parts[0]},${parts[1]}`)
    }

    return http.getDataAsJSON({
      url: utils.urls.join(this.baseUrl, endpoint),
      query
    })
  }
}

export default RESTModel
