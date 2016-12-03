/* eslint-disable no-console */

/**
 * Populate data in the database from the remote data sources.
 *
 * @example
 * node populateData
 *
 * @module redtail/bin/populateData
 */

import * as modules from '../modules'

const models = modules.models

// neighborhoods must be loaded first
modules.neighborhoods.populate(models)
  .then((neighborhoods) => {
    console.log(`loaded ${neighborhoods.length} neighborhoods into the database`)
  })
  .then(() => modules.rodents.populate(models))
  .then((rodents) => {
    console.log(`loaded ${rodents.length} rodents into the database`)
  })
  .then(() => modules.establishments.populate(models))
  .then((establishments) => {
    console.log(`loaded ${establishments.length} establishments into the database`)
  })
  .catch((err) => {
    console.error(err)
  })
