/**
 * @module redtail/modules/neighborhoods/actions/saveData
 */

function saveData(model) {
  return state => model.save(state.data)
    .then((response) => {
      state.loadResponse(response)
      return state
    })
}

export default saveData
