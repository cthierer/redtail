/**
 * @module redtail/modules/models/definitions/agency
 */

import Sequelize from 'sequelize'

/**
 * Initialize a Sequelize model for an Agency.
 * @param {Sequelize} sequelize Instance of the Sequelize class.
 * @param {Object} options Additional Sequelize model options.
 * @returns {Model} The loaded Sequelize model.
 * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration
 */
function initAgency(sequelize, options = {}) {
  const Agency = sequelize.define('Agency', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  }, Object.assign(options || {}, {
    tableName: 'agencies',
    classMethods: {
      associate: (models) => {
        Agency.hasMany(models.Rodent, {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        })
      }
    }
  }))

  return Agency
}

export default initAgency
