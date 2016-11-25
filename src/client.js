/**
 * Entry point for the client component.
 * @module redtail/client
 */

import riot from 'riot/riot'
import * as neighborhoods from './modules/neighborhoods/tags'

/* eslint-env browser */

// load globals on browser window, if this is a browser
window.riot = riot

/**
 * Mount a tag as the main application tag.
 * @param {string} tag The tag to mount.
 * @param {object} state Optional state parameters that should be passed as
 *  options to the tag. Will be mounted to `opts.state`.
 */
function mount(tag, state = {}) {
  const mounted = riot.mount('#redtailApp', tag, { state })

  mounted.forEach((mountedTag) => {
    if (typeof state.on === 'function') {
      state.on('core.state.updated', (updated) => {
        mountedTag.update({ state: updated })
      })
    }
  })
}

// initialize neighborhoods routes
neighborhoods.init(riot.route, mount, '/neighborhoods/')

// start listining to route changes
riot.route.start(true)

export default { riot }
