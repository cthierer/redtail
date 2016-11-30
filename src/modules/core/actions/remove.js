/**
 * @module redtail/modules/neighborhoods/actions/remove
 */

function remove(model) {
  return state => model.remove(state.id)
    .then(() => {
      state.loadResponse({})
      return state
    })
}

export default remove
