/**
 * @module redtail/modules/neighborhoods/actions/loadAll
 */

/**
 * Load all matching model instances into the application state.
 *
 * Triggers `notifyError` on the state if an error occurrs.
 *
 * @param {RESTModel} model The data model to load.
 * @param {object} defaultOptions Default options that should be passed
 *  when mkaing the query. State options will override default options if
 *  there are conflicts.
 * @returns {function} When called with a State parameter, retrieves all
 *  models that match the state, and loads the response into the state.
 *  The function returns a Promise that resolves when the state has finished
 *  updating.
 * @see {RESTModel#findAll}
 */
function loadAll(model, defaultOptions = {}) {
  return state => model.findAll(Object.assign({}, defaultOptions, state.getQueryOptions()))
    .then((response) => {
      state.loadResponse(response)
      return state
    })
    .catch((err) => {
      state.notifyError('Unexpected error while loading data.', err.body)
    })
}

export default loadAll
