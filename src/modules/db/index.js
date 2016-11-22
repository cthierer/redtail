/**
 * @module redtail/modules/db
 */

import Sequelize from 'sequelize'
import Config from 'config'
import initDefinitions from './definitions'

/**
 * The database configuration object from the application configuration.
 * Expected to contain:
 *  - `database`: the name of the database to connect to.
 *  - `username`: the database user to connect as.
 *  - `password`: the password for the specified database user.
 *  - `options`: additional options to pass to the Sequelize constructor.
 *
 * @see http://docs.sequelizejs.com/en/v3/api/sequelize/#new-sequelizedatabase-usernamenull-passwordnull-options
 * @type {Object}
 */
const config = Config.get('db')

/**
 * Sequelize instance, initialized to the database connection defined in the
 * application `db` configuration object.
 *
 * @see http://docs.sequelizejs.com/en/v3/api/sequelize/
 * @type {Sequelize}
 */
const sequelize = new Sequelize(config.database, config.username, config.password, config.options)

/**
 * Initialized Sequelize models, loaded from the ./models directory.
 *
 * Each key is the name of the model (first letter is capitalized), and the
 * value is the initialized Sequelize Model definition.
 *
 * @see http://docs.sequelizejs.com/en/v3/api/model/
 * @type {Object}
 */
const models = initDefinitions(sequelize, {
  timestamps: true,
  paranoid: false,
  underscored: true
})

export default models
export { sequelize }
