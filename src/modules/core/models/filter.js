/**
 * @module redtail/modules/core/models/filter
 */

import DataEmitter from './data-emitter'

/**
 * The identifier for the offset value in the filter object.
 * @type {string}
 */
const OFFSET = 'offset'

/**
 * The identifier for the limit value in the filter object.
 * @type {string}
 */
const LIMIT = 'limit'

/**
 * The identifier for the where value in the filter object.
 * @type {string}
 */
const WHERE = 'where'

/**
 * Encapsulate information filter information, including:
 *  - `limit`: maximum number of results
 *  - `offset`: starting index for results
 *  - `where`: conditions that all results must meet
 *
 * @class
 * @extends {DataEmitter}
 */
class Filter extends DataEmitter {
  constructor() {
    super('filter')
  }

  /**
   * @return {integer} The maximum number of results to match.
   */
  get limit() {
    return this.get(LIMIT)
  }

  /**
   * Update the limit value.
   * @param {integer} value The maximum number of results to match.
   */
  set limit(value) {
    this.set(LIMIT, value)
  }

  /**
   * @return {integer} The starting index for the result set.
   */
  get offset() {
    return this.get(OFFSET)
  }

  /**
   * Update the offset value.
   * @param {integer} value The starting index for the result set.
   */
  set offset(value) {
    this.set(OFFSET, value)
  }

  /**
   * Add a filter "where" condition.
   * @param {object} condition Condition to join to the filter clause.
   */
  addWhere(condition) {
    if (condition) {
      const where = this.get(WHERE) || {}
      this._set(OFFSET, 0)
      this._set(WHERE, Object.assign(where, condition))
      this.emit('core.filter.whereUpdated')
      this.updated()
    }
  }

  /**
   * Update the filter object with the given value object.
   * Does not emit any events.
   * @param {object} value Update the filter object to match this object.
   */
  update(value) {
    this._update(value)
  }
}

export default Filter
export { OFFSET, LIMIT, WHERE }
