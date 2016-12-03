/**
 * @module redtail/modules/neighborhoods/actions/remove
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
