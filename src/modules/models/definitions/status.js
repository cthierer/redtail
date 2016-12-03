/**
 * @module redtail/modules/models/definitions/status
 */

import Sequelize from 'sequelize'

/**
 * Initialize a Sequelize model for a Status.
 * @param {Sequelize} sequelize Instance of the Sequelize class.
 * @param {Object} options Additional Sequelize model options.
 * @returns {Model} The loaded Sequelize model.
 * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration
 */
function initStatus(sequelize, options = {}) {
  const Status = sequelize.define('Status', {
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    }
  }, Object.assign(options || {}, {
    tableName: 'statuses',
    classMethods: {
      associate: (models) => {
        Status.hasMany(models.Rodent, {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        })
      }
    }
  }))

  return Status
}

export default initStatus
