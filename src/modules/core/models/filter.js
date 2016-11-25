
import DataEmitter from './data-emitter'

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
    return this.get('limit')
  }

  /**
   * Update the limit value.
   * @param {integer} value The maximum number of results to match.
   */
  set limit(value) {
    this.set('limit', value)
  }

  /**
   * @return {integer} The starting index for the result set.
   */
  get offset() {
    return this.get('offset')
  }

  /**
   * Update the offset value.
   * @param {integer} value The starting index for the result set.
   */
  set offset(value) {
    this.set('offset', value)
  }

  /**
   * Add a filter "where" condition.
   * @param {object} condition Condition to join to the filter clause.
   */
  addWhere(condition) {
    if (condition) {
      const where = this.get('where') || {}
      this.set('where', Object.assign(where, condition))
    }
  }
}

export default Filter
