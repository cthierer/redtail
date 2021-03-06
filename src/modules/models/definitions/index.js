/**
 * @module redtail/modules/models/definitions
 */

import agency from './agency'
import establishment from './establishment'
import neighborhood from './neighborhood'
import rodent from './rodent'
import source from './source'
import status from './status'

/**
 * Collection of all Sequelize model initializers for the application.
 * This is used to programmatically initialize the models.
 * @type {array}
 */
const initializers = [
  agency,
  establishment,
  neighborhood,
  rodent,
  source,
  status
]

/**
 * Load all of the module models into the instance of Sequelize.
 * @param {Sequelize} sequelize The instance of Sequelize to load models into.
 * @param {Object} options Additional Sequelize model configuration options.
 * @returns {Object} Mapping of model name to Sequelize Model definition.
 * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration
 */
function init(sequelize, options = {}) {
  const models = initializers.reduce((loaded, initializeModel) => {
    const modelDefinition = initializeModel(sequelize, options)
    return Object.assign(loaded, {
      [modelDefinition.name]: modelDefinition
    })
  }, {})

  Object.keys(models).forEach((modelName) => {
    const model = models[modelName]
    if (typeof model.associate === 'function') {
      model.associate(models)
    }
  })

  return models
}

export default {
  neighborhood
}

export { init }
