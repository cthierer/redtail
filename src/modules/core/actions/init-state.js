/**
 * @module redtail/modules/core/actions/initState
 */

import State from '../models/state'
import * as stateUtils from '../utils/state'

/**
 * Initialize a new state object with the given options.
 * @param {object} stateOptions The options to pass to the State constructor.
 * @returns {function} A function that when called, initilaizes a Sate and
 *  returns it to the caller.
 * @see {State}
 */
function initState(stateOptions = {}) {
  return () => {
    const state = new State(stateOptions)

    state.on('core.links.navigate', (toLink) => {
      stateUtils.loadLink(toLink, state)
    })

    return state
  }
}

export default initState
