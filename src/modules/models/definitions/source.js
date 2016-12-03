/**
 * @module redtail/modules/models/definitions/source
 */

import Sequelize from 'sequelize'

/**
 * Initialize a Sequelize model for a Source.
 * @param {Sequelize} sequelize Instance of the Sequelize class.
 * @param {Object} options Additional Sequelize model options.
 * @returns {Model} The loaded Sequelize model.
 * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration
 */
function initSource(sequelize, options = {}) {
  const Source = sequelize.define('Source', {
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    }
  }, Object.assign(options || {}, {
    tableName: 'sources',
    classMethods: {
      associate: (models) => {
        Source.hasMany(models.Rodent, {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        })
      }
    }
  }))

  return Source
}

export default initSource
