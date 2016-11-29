/**
 * @module redtail/modules/models/definitions/rodent
 */

import Sequelize from 'sequelize'

/**
 * Initialize a Sequelize model for a Rodent.
 * @param {Sequelize} sequelize Instance of the Sequelize class.
 * @param {Object} options Additional Sequelize model options.
 * @returns {Model} The loaded Sequelize model.
 * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration
 */
function initRodent(sequelize, options = {}) {
  const Rodent = sequelize.define('Rodent', {
    street: {
      type: Sequelize.STRING,
      allowNull: false
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 2,
          msg: 'Must be a two-character state postal abberviation'
        },
        isUppercase: {
          args: true,
          msg: 'Postal code must be capitalized'
        }
      }
    },
    zip: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[0-9]{5}(-[0-9]{4})?$/,
          msg: 'Must be a 5-digit Zip, or 9-digit Zip+4 code (including the hyphen)'
        }
      }
    },
    latitude: {
      type: Sequelize.DOUBLE,
      validate: { min: -90, max: 90 }
    },
    longitude: {
      type: Sequelize.DOUBLE,
      validate: { min: -180, max: 180 }
    },
    notes: Sequelize.STRING
  }, Object.assign(options || {}, {
    tableName: 'rodents',
    classMethods: {
      associate: (models) => {
        Rodent.belongsTo(models.Agency)
        Rodent.belongsTo(models.Neighborhood)
        Rodent.belongsTo(models.Status)
        Rodent.belongsTo(models.Source)
      }
    }
  }))

  return Rodent
}

export default initRodent
