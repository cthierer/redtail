/**
 * @module redtail/modules/core/middleware/remove
 */

function remove(model) {
  return (req, res, next) => {
    const id = req.params.id

    model.destroy({ where: { id } })
      .then(() => {
        req.ctx.status = 202
        next()
      })
      .catch(next)
  }
}

export default remove
