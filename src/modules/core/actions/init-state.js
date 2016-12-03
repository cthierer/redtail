/**
 * @module redtail/modules/core/actions/initState
 */

import State from '../models/state'
import * as stateUtils from '../utils/state'
import { propagate } from '../../utils/events'

/**
 * Initialize a new state object with the given options.
 * @param {object} stateOptions The options to pass to the State constructor.
 * @returns {function} A function that when called, initilaizes a State and
 *  returns it to the caller. The function can be called with a `rootState`
 *  argument, which will "extend" the new state from the `rootState`. The
 *  `rootState` will emit all events emitted by the new state.
 * @see {State}
 */
function initState(stateOptions = {}) {
  return (rootState) => {
    const state = new State(stateOptions)

    // listen to navigation events
    state.on('core.links.navigate', (toLink) => {
      stateUtils.loadLink(toLink, state)
    })

    // extend from the root state, if defined
    if (rootState) {
      propagate(state, rootState)
    }

    return state
  }
}

export default initState
