
import Config from 'config'
import { geocode } from './index'

function getCoordinates() {
  return (req, res, next) => {
    const address = {
      street: req.query.street,
      state: req.query.state,
      city: req.query.city,
      zip: req.query.zip
    }

    geocode(address, Config.get('geocoder'))
      .then((coordinates) => {
        req.ctx.status = 200
        req.ctx.result = coordinates
        next()
      })
      .catch(next)
  }
}

export default getCoordinates
