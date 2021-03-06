/**
 * @module redtail/modules/core/models/sort
 */

import DataEmitter from './data-emitter'

/**
 * Key to sort fields in the ascending direction.
 * @type {string}
 */
const ASC = 'asc'

/**
 * Key to sort fields in the descending direction.
 * @type {string}
 */
const DESC = 'desc'

/**
 * Encapsulate sorting details.
 * @class
 * @extends {DataEmitter}
 */
class Sort extends DataEmitter {
  /**
   * @constructor
   * @param {boolean} allowMultiple Whether or not multiple sorting parameters
   *  are allowed to be set at once; defaults to false, indicating that only
   *  one sorting parameter may be active at a time.
   */
  constructor(allowMultiple = false) {
    super('sort')

    /**
     * Whether or not multiple sorting parameters are allowed to be set at once.
     * @type {boolean}
     */
    this.allowMultiple = allowMultiple
  }

  /**
   * Generate a consolidated representation of the sort defined for the
   * specified field.
   * @returns {array} The representation for the field, if the field
   *  is defined on the data object; otherwise, returns null.
   */
  _getField(field) {
    const direction = this.getDirection(field)
    if (direction) {
      return [field, direction]
    }
    return null
  }

  /**
   * Add a sort parameter.
   * @param {string} field The field to sort on.
   * @param {string} order The direction of the sort ("asc", "desc").
   */
  addSort(field, order) {
    this.set(field, order)
  }

  /**
   * Get the string representation of the specified field's sort parameter.
   * @param {string} field The field to retrieve; optional.
   * @returns {string|array} The string represenation of the given field, if
   *  defined (null if not). If no field is specified, then returns the string
   *  representation of _every_ field defined in this instance.
   */
  get(field) {
    if (field) {
      return this._getField(field)
    }

    return this.keys.reduce((fields, key) => {
      const fieldData = this._getField(key)
      if (fieldData) {
        return fields.concat([fieldData])
      }
      return fields
    }, [])
  }

  /**
   * Lookup the sort direction for the sepcified field.
   * @param {string} field The field to lookup.
   * @returns {string} The direction for the specified field.
   */
  getDirection(field) {
    return super.get(field)
  }

  /**
   * Set the direction for the given field. If multiple sort parameters are
   * allowed, then existing sort fields will be left intact; otherwise, they
   * will be cleared out.
   * @param {string} field The field to set the sort direction of.
   * @param {string} order The order the given field should be sorted in;
   *  defaults to "asc" if not specified.
   */
  set(field, order = ASC) {
    if (!this.allowMultiple) {
      this._reset()
    }
    super.set(field, order)
  }

  /**
   * Toggle the sort direction for the specified field - if the field is
   * currently ordered ascending, then it will be switched to descending, and
   * vice versa. If the field is not already sorted, then it will set the field
   * to be sortable, following the same rules as the `#set` method.
   * @param {string} field The field to toggle the sort direction of.
   * @see {Sort#set}
   */
  toggle(field) {
    switch (this.getDirection(field)) {
      case ASC:
        this.set(field, DESC)
        break
      case DESC:
      default:
        this.set(field, ASC)
    }
  }

  /**
   * Update the sort object with the given value object.
   * Does not emit any events.
   * @param {object} value Update the sort object to match this object.
   */
  update(value) {
    this._update(value)
  }
}

export default Sort
export { ASC, DESC }
