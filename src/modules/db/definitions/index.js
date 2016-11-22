/**
 * @module redtail/modules/db/definitions
 */

import initNeighborhood from './neighborhood'

/**
 * Collection of all Sequelize model initializers for the application.
 * This is used to programmatically initialize the models.
 * @type {array}
 */
const initializers = [initNeighborhood]

/**
 * Load all of the module models into the instance of Sequelize.
 * @param {Sequelize} sequelize The instance of Sequelize to load models into.
 * @param {Object} options Additional Sequelize model configuration options.
 * @returns {Object} Mapping of model name to Sequelize Model definition.
 * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration
 */
function initDefinitions(sequelize, options = {}) {
  return initializers.reduce((loaded, initializeModel) => {
    const modelDefinition = initializeModel(sequelize, options)
    return Object.assign(loaded, {
      [modelDefinition.name]: modelDefinition
    })
  }, {})
}

export default initDefinitions
