
import EventEmitter from 'events'
import DataEmitter from './data-emitter'
import Sort from './sort'
import Links from './links'
import * as utils from '../../utils'

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
  constructor() {
    super()

    /**
     * The active filter for the given result set.
     * @type {DataEmitter}
     */
    this.filter = new DataEmitter('filter')

    /**
     * The active sort for the given result set.
     * @type {Sort}
     */
    this.sort = new Sort()

    /**
     * The related links for the given result set.
     * @type {Links}
     */
    this.links = new Links()

    /**
     * The result data for the current state.
     * @type {object}
     * @private
     */
    this._result = {}

    // propagate any events fired on filter, sort, and links through this
    // event emitter - consumers don't have to know how this is implemented,
    // just have to listen to events on the state instance

    utils.events.propagate(this.filter, this)
    utils.events.propagate(this.sort, this)
    utils.events.propagate(this.links, this)
  }

  /**
   * Fires the "core.state.updated" event, indicating that the application
   * state has been updated. Passed the this State instance.
   */
  updated() {
    this.emit('core.state.updated', this)
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
}

export default State
