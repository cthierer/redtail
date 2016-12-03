/**
 * @module redtail//tags
 */

/**
 * Mapping of identifiers to Riot tags mountable by this module.
 * @type {object}
 */
const tags = {
  landing: 'redtail-landing'
}

/**
 * Perform necessary initialization to load tags into the application.
 * @param {function} route Router function, used to match routes and fire
 *  actions. Matches the API exposed by Riot.
 * @param {function} mount A function that will mount a tag in the application.
 *  Called with the tag name (string), and an object with data to pass in as
 *  options when mounting.
 * @param {function} mixin A function that loads a mixin into the application
 *  context. Follows the same conventions as Riot mixins.
 * @param {object} config The configuration object for the application.
 * @see http://riotjs.com/api/route/
 * @see http://riotjs.com/api/#mixins
 */
async function init(route, mount) {
  route('/', () => {
    mount(tags.landing)
  })
}

export { init, tags }
