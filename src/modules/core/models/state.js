
import EventEmitter from 'events'
import Sort from './sort'
import Links from './links'
import Filter from './filter'
import * as utils from '../../utils'

/**
 * Identifier for the order key in the query parameters generated by the state.
 * @type {string}
 */
const ORDER = 'order'

/**
 * Encapsulate application state.
 *
 * Emits the following events:
 *  - `core.state.updated`: fired whenever the result set is updated.
 *  - `core.filter.updated`: fired whenever the search filter is updated.
 *  - `core.sort.updated`: fired whenever the sort is updated.
 *  - `core.links.updated`: fired whenever the links are updated.
 *  - `core.links.navigate`: fired to navigate to the specified data link.
 *
 * @class
 * @extends {EventEmitter}
 */
class State extends EventEmitter {
  /**
   * @constructor
   * @param {object} options Configuration options for this object.
   */
  constructor(options) {
    super()

    const config = Object.assign({
      sort: {
        allowMultiple: false
      }
    }, options)

    /**
     * The total number of results that match this request, ignoring any
     * paging parameters.
     * @member
     * @type {integer}
     */
    this.count = undefined

    /**
     * The active filter for the given result set.
     * @type {Filter}
     */
    this.filter = new Filter()

    /**
     * The related links for the given result set.
     * @type {Links}
     */
    this.links = new Links()

    /**
     * The active sort for the given result set.
     * @type {Sort}
     */
    this.sort = new Sort(config.sort.allowMultiple === true)

    /**
     * The result data for the current state.
     * @type {object}
     * @private
     */
    this._result = null

    // propagate any events fired on filter, sort, and links through this
    // event emitter - consumers don't have to know how this is implemented,
    // just have to listen to events on the state instance

    utils.events.propagate(this.filter, this)
    utils.events.propagate(this.sort, this)
    utils.events.propagate(this.links, this)

    this.on('core.filter.updated', () => { this.queryUpdated() })
    this.on('core.sort.updated', () => { this.queryUpdated() })
  }

  /**
   * @returns {object} The result data for this state.
   */
  get result() {
    return this._result
  }

  /**
   * Set the result data, and fire the state updated event.
   * @param {object} value The updated result value.
   */
  set result(value) {
    this._result = value
    this.updated()
  }

  /**
   * Return the filter data for the current state.
   * @returns {object} The filter values.
   * @see {Filter#get}
   */
  getFilter() {
    return this.filter.get() || {}
  }

  /**
   * Return the sort data for the current state.
   * @returns {array} The array of sort values, formatted as `field,direction`.
   * @see {Sort#get}
   */
  getSort() {
    return this.sort.get() || []
  }

  /**
   * Generate Sequelize-compatible query options based on the current state.
   * @returns {object} The query options object.
   */
  getQueryOptions() {
    return Object.assign({
      [ORDER]: this.getSort()
    }, this.getFilter())
  }

  /**
   * Load a response into the application state, and trigger the update event.
   * @param {object} response The response object to load.
   */
  loadResponse(response) {
    this._result = response.result
    this.count = response.total
    this.links.update(response._links)
    this.updated()
  }

  /**
   * Generate a response object from the current state.
   * @returns {object} The generated response object.
   */
  toResponse() {
    if (!this.result) {
      return null
    }

    return {
      result: this.result,
      total: this.count,
      _links: this.links.get()
    }
  }

  /**
   * Fires the "core.state.updated" event, indicating that the application
   * state has been updated. Passed the this State instance.
   */
  updated() {
    this.emit('core.state.updated', this)
  }

  queryUpdated() {
    this.emit('core.state.queryUpdated', this)
  }
}

export default State
export { ORDER }
