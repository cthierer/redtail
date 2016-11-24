
/**
 * Encapsulate the request context. Middleware functions may modify this
 * context as the request is processed through the middleware chain.
 * In almost all cases, middleware should _only_ interact with the context.
 * Middleware may set any value on the context.
 * @class
 */
class Context {
  constuctor() {
    /**
     * The HTTP status code that should be sent back to the client.
     * Defaults to 404 (Not Found).
     * @private
     * @member
     * @type {integer}
     * @see https://nodejs.org/api/http.html#http_http_status_codes
     */
    this._status = 404

    /**
     * Track if the status was set via the setter, or if it is the default
     * value.
     * @private
     * @member
     * @type {boolean}
     */
    this._statusSet = false

    /**
     * The total number of results that match this request, ignoring any
     * paging parameters.
     * @member
     * @type {integer}
     */
    this.count = undefined

    /**
     * The data filter generated from this request. The filter is passed to the
     * model when querying for matching data instances. Should match the
     * filter object expected by sequelize.
     * @member
     * @type {object}
     * @see http://docs.sequelizejs.com/en/v3/api/model/#findalloptions-promisearrayinstance
     */
    this.filter = {}

    /**
     * HATEOAS links for this request.
     * @member
     * @type {object}
     * @see https://tools.ietf.org/html/draft-kelly-json-hal-08
     */
    this.links = {}

    /**
     * The result data that should be returned to the client. Can be an
     * object, or an array of objects.
     * @member
     * @type {object|array}
     */
    this.result = {}
  }

  /**
   * @returns {integer} The HTTP status code that should be set back to the
   *  client.
   */
  get status() {
    return this._status
  }

  /**
   * @param {integer} value The HTTP status code that should be returned to the
   *  client.
   */
  set status(value) {
    this._status = value
    this._statusSet = true
  }

  /**
   * @returns {boolean} Whether or not the status has been changed since
   *  the context was initialized.
   */
  get statusSet() {
    return this._statusSet
  }

  /**
   * @returns {object} The complete response body, including the result data,
   *  total count, and HATEOAS links (if any).
   */
  get responseBody() {
    return {
      result: this.result,
      total: this.count,
      _links: this.links
    }
  }

  /**
   * @returns {integer} The maximum number of results to return.
   */
  get limit() {
    return this.filter ? this.filter.limit : null
  }

  /**
   * Set the maximum number of results that should be returned.
   * @param {integer} value The number of results that should be returned;
   *  should be a positive, non-integer integer.
   */
  set limit(value) {
    if (!this.filter) {
      this.filter = {}
    }

    this.filter.limit = value
  }

  /**
   * @returns {integer} The result offset.
   */
  get offset() {
    return this.filter ? this.filter.offset : null
  }

  /**
   * Set the result offset, allowing requestors to skip any number of results
   * in the result set.
   * @param {integer} value The starting index for the result set; the first
   *  element is always at index 0 (value = 0). Should be a positive integer.
   */
  set offset(value) {
    if (!this.filter) {
      this.filter = {}
    }

    this.filter.offset = value
  }

  /**
   * Add a HATEOAS link to the link collection.
   * @param {string} key The identifier for the link. Ex., "next", "add".
   * @param {string|object} href The value of the link. If a string, then the
   *  value is treated as the `href` attribute of the link. Otherwise, the
   *  literal object is used.
   */
  addLink(key, href) {
    if (!href) {
      return
    }

    if (!this.links) {
      this.links = {}
    }

    this.links[key] = typeof href === 'object' ? href : { href }
  }

  /**
   * Add a sorting parameter to the filter.
   * @param {string} field The field to sort by.
   * @param {string} order The direction of the sort; should be either "asc" or
   *  "desc".
   */
  addSort(field, order) {
    if (!field || !order) {
      return
    }

    if (!this.filter) {
      this.filter = {}
    }

    if (!this.filter.order) {
      this.filter.order = []
    }

    this.filter.order.push([field, order])
  }

  /**
   * Add a where filter to the existing filter. Added as an "and" condition
   * to any existing conditions.
   * @param {object} filter The filter to include in the where clause.
   */
  addWhere(filter) {
    if (!filter) {
      return
    }

    if (!this.filter) {
      this.filter = {}
    }

    if (!this.filter.where) {
      this.filter.where = {}
    }

    this.filter.where = Object.assign(this.filter.where, filter)
  }
}

export default Context
