/**
 * @module redtail/modules/profiler/profile
 */

/**
 * Encapsulate information about a request profile.
 * @class
 */
class Profile {
  constructor() {
    /**
     * Profile data.
     * @type {object}
     * @private
     */
    this._data = {}
  }

  /**
   * @returns {object} Profile data.
   */
  get data() {
    return this._data
  }

  /**
   * Set a value on the profile at the given path. Creates the path if it
   * does not already exist.
   * @param {string} path The dot-separated path to the value to set.
   * @param {any} value The value to set.
   */
  set(path, value) {
    const parts = path.split('.')
    const dest = parts.slice(0, -1).reduce((data, property) => {
      if (!data[property]) {
        data[property] = {}
      }
      return data[property]
    }, this._data)

    dest[parts[parts.length - 1]] = value
  }

  /**
   * Get the value from the profile at the given path.
   * @param {string} path The dot-separated path to the value to retrieve.
   * @param {any} defaultValue If the specified path is not set, then set
   *  it to this value, then return this value. Optional.
   * @returns {any} The value for the specified path, or null if no value was
   *  found.
   */
  get(path, defaultValue) {
    if (defaultValue && !this.has(path)) {
      this.set(path, defaultValue)
    }
    return path.split('.').reduce((data, property) => data && data[property], this._data)
  }

  /**
   * Check if the specified path has a value.
   * @param {string} path The dot-separated path to the value to check.
   * @returns {boolean} True if the value is set.
   */
  has(path) {
    const value = this.get(path)
    return value !== null && value !== undefined
  }
}

export default Profile
