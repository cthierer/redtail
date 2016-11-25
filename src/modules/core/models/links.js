/**
 * @module redtail/modules/core/models/links
 */

import DataEmitter from './data-emitter'

/**
 * Encapsulate data about HATEOAS links.
 * @class
 * @extends {DataEmitter}
 */
class Links extends DataEmitter {
  constructor() {
    super('links')
  }

  /**
   * @returns {object} The link for the "next" property of the data object.
   */
  get next() {
    return this.get('next')
  }

  /**
   * @returns {object} The link for the "previous" property of the data object.
   */
  get previous() {
    return this.get('previous')
  }

  /**
   * Add a HATEOAS link.
   * @param {string} key The identifier for the link.
   * @param {string|object} href Either the HATEOAS object including an `href`
   *  attribute, or a URL string of the link that will be set as the `href`
   *  attribute.
   */
  addLink(key, href) {
    if (!href) {
      return
    }

    if (typeof href === 'object') {
      this.set(key, href)
    } else {
      this.set(key, { href })
    }
  }

  /**
   * Emit an event to navigate to a specified link, if it exists. If the key
   * has an associated link, this emits the "core.links.navigate" event,
   * passing in the value of the link.
   * @param {string} toKey The key to navigate to.
   */
  navigate(toKey) {
    const link = this.get(toKey)
    if (link) {
      this.emit('core.links.navigate', link)
    }
  }

  /**
   * Update the links in the data object with those passed in, erasing any
   * previously set links (even if they are not overriden).
   * Does _not_ emit an updated event.
   * @param {object} fromObj The value of the new data object.
   */
  update(fromObj) {
    this._update(fromObj || {})
  }
}

export default Links
