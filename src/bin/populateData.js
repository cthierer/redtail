/* eslint-disable no-console */

/**
 * @module redtail/bin/populateData
 */

import modules from '../modules'

const models = modules.models

modules.neighborhoods.populate(models)
  .then((neighborhoods) => {
    console.log(`loaded ${neighborhoods.length} neighborhoods into the database`)
  })
  .catch((err) => {
    console.error(err)
  })
