/**
 * @module redtail/modules/neighborhoods/actions/saveData
 */

/**
 * Save data for the specified model.
 *
 * Calls the `notifySuccess` event on the state if the operation is successful;
 * otherwise, calls the `notifyError` event.
 *
 * @param {RESTModel} model The data model to save data for.
 * @returns {function} When called with a state parameter, saves the data
 *  from `state.data` using the model definition. The response of the operation
 *  is loaded into the state.
 * @see {RESTModel#save}
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
