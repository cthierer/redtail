/**
 * @module redtail/modules/core/models/dataEmitter
 */

import EventEmitter from 'events'

/**
 * Manages a data object, and emits events when data is changed.
 * @class
 * @extends {EventEmitter}
 */
class DataEmitter extends EventEmitter {
  /**
   * @constructor
   * @param {string} identifier The identifier that should be included in the
   *  event names fired by this instance; defaults to "data".
   */
  constructor(identifier = 'data') {
    super()

    /**
     * The data maintained by this instance.
     * @type {object}
     * @private
     */
    this._data = {}

    /**
     * The identifier for this instance, specified during instantiation.
     * @type {string}
     */
    this.identifier = identifier
  }

  /**
   * @returns {array} The list of keys set on this instance.
   */
  get keys() {
    return Object.keys(this._data)
  }

  /**
   * Clear all data that has already been set.
   * Does _not_ emit any events.
   */
  _reset() {
    this._update({})
  }

  /**
   * Update the data object to match the specified object, clearing out any
   * existing data that has been set.
   * Does _not_ emit any events.
   * @param {object} fromObj The new data object for this instance.
   */
  _update(fromObj) {
    this._data = fromObj
  }

  /**
   * Clear the specified key from the data object; if no key is specified, then
   * reset the entire object.
   * Emits the updated event if data is cleared by this action.
   * @param {string} key The key to clear; if not specified, then the entire
   *  data object is cleared.
   * @see {DataEmitter#updated}
   */
  clear(key) {
    if (!key) {
      this._reset()
      this.updated()
    } else if (this.has(key)) {
      delete this._data[key]
      this.updated()
    }
  }

  /**
   * Get the value of the specified key from the data object; if no key is
   * specified, then return the entire object.
   * @param {string} key The key to retrieve the value of.
   * @returns {any} The value associated to the specified key value, or the
   *  complete data object if key is not specified.
   */
  get(key) {
    return this._data && key ? this._data[key] : this._data
  }

  /**
   * Check if the specified key is defined.
   * @param {string} key The key to check the existence of.
   * @returns {boolean} Whether or not the key exists and is defined.
   */
  has(key) {
    return key && this._data[key] !== undefined
  }

  /**
   * Set the value for a key. Overwrites an existing value, if defined.
   * Emits the updated event.
   * @param {string} key The key of the value to update.
   * @param {any} value The new value of the key.
   * @see {DataEmitter#updated}
   */
  set(key, value) {
    this._data[key] = value
    this.updated()
  }

  /**
   * Fire the "updated" event for this emitter, indicating that the data
   * object has been updated. The event name will be of the format
   * "core.{identifier}.updated", where "{identifier}" is the value passed
   * in at object instantiation.
   */
  updated() {
    this.emit(`core.${this.identifier}.updated`, this.get())
  }
}

export default DataEmitter
