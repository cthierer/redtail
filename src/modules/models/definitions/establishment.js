/**
 * @module redtail/modules/models/definitions/establishment
 */

import Sequelize from 'sequelize'

/**
 * Initialize a Sequelize model for a Establishment.
 * @param {Sequelize} sequelize Instance of the Sequelize class.
 * @param {Object} options Additional Sequelize model options.
 * @returns {Model} The loaded Sequelize model.
 * @see http://docs.sequelizejs.com/en/v3/docs/models-definition/#configuration
 */
function initEstablishment(sequelize, options = {}) {
  const Establishment = sequelize.define('Establishment', {
    name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    street: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    city: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    state: {
      type: Sequelize.STRING(2),
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
      type: Sequelize.STRING(10),
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
    }
  }, Object.assign(options || {}, {
    tableName: 'establishments',
    classMethods: {
      associate: (models) => {
        Establishment.belongsTo(models.Neighborhood)
      }
    }
  }))

  return Establishment
}

export default initEstablishment
