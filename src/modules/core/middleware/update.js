/**
 * @module redtail/modules/core/middleware/update
 */

function update(model) {
  return (req, res, next) => {
    const id = req.params.id
    const data = req.body

    model.update(data, { where: { id } })
      .then(() => model.findById(id))
      .then(instance => instance.get())
      .then((result) => {
        req.ctx.status = 200
        req.ctx.result = result
        next()
      })
      .catch(next)
  }
}

export default update
