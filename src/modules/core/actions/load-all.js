/**
 * @module redtail/modules/neighborhoods/actions/loadAll
 */

/**
 * Load all matching Neighborhood models into the application state.
 * @param {object} model The data model for a Neighborhood.
 * @returns {function} When called with a State parameter, retrieves all
 *  models that match the state, and loads the response into the state.
 *  The function returns a Promise that resolves when the state has finished
 *  updating.
 */
function loadAll(model, defaultOptions = {}) {
  return state => model.findAll(Object.assign({}, defaultOptions, state.getQueryOptions()))
    .then((response) => {
      state.loadResponse(response)
      return state
    })
}

export default loadAll
