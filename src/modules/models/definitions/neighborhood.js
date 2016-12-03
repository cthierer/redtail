/**
 * @module redtail/modules/models/definitions/neighborhood
 */

import Sequelize from 'sequelize'

/**
 * Initialize a Sequelize model for a Neighborhood.
 * @param {Sequelize} sequelize Instance of the Sequelize class.
 * @param {Object} options Additional Sequelize model options.
 * @returns {Model} The loaded Sequelize model.
 * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration
 */
function initNeighborhood(sequelize, options = {}) {
  const Neighborhood = sequelize.define('Neighborhood', {
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    },
    area: Sequelize.DOUBLE
  }, Object.assign(options || {}, {
    tableName: 'neighborhoods',
    classMethods: {
      associate: (models) => {
        Neighborhood.hasMany(models.Rodent, {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        })
        Neighborhood.hasMany(models.Establishment, {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        })
      }
    }
  }))

  return Neighborhood
}

export default initNeighborhood
