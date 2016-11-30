/**
 * @module redtail/modules/core/middleware/create
 */

function create(model) {
  return (req, res, next) => {
    const data = req.body

    model.create(data)
      .then(instance => instance.get())
      .then((result) => {
        req.ctx.status = 201
        req.ctx.result = result
        next()
      })
      .catch(next)
  }
}

export default create
