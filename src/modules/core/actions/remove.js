/**
 * @module redtail/modules/neighborhoods/actions/remove
 */

/**
 * Trigger a "delete" request to remove a specified entity.
 *
 * Triggers a `notifyInfo` event on the state when the operation results in
 * a success; otherwise, triggers a `notifyError` event on the state.
 *
 * @param {RESTModel} model The data model.
 * @returns {function} When called with a State parameter, removes the entity
 *  instance specified by `state.id`.
 * @see {RESTModel#remove}
 */
function remove(model) {
  const modelName = model.modelName || 'record'
  return state => model.remove(state.id)
    .then(() => {
      state.loadResponse({})
      state.notifyInfo(`Deleted the ${modelName}.`)
      return state
    })
    .catch((err) => {
      state.notifyError(`Unable to delete the ${modelName}. Please try again.`, err.body)
    })
}

export default remove
