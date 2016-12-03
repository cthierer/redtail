/**
 * @module redtail/modules/neighborhoods/actions/saveData
 */

function saveData(model) {
  const modelName = model.modelName || 'record'
  return state => model.save(state.data)
    .then((response) => {
      state.loadResponse(response)
      state.notifySuccess(`Successfully saved the ${modelName}!`, {
        message: `ID: ${response.result.id}`
      })
      return state
    })
    .catch((err) => {
      state.notifyError(`Unable to save the ${modelName}. Please check your submission, and try again.`, err.body)
    })
}

export default saveData
