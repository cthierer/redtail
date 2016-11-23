/**
 * @module redtail/modules/models
 */

import Sequelize from 'sequelize'
import Config from 'config'
import * as definitions from './definitions'
import * as Logger from '../logger'

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
const config = Config.get('models.db')

/**
 * Logger for the models module.
 * @type {Object}
 */
const logger = Logger.get('models')

/**
 * Logger for sequelize. This is a child logger to the main module logger,
 * with the additional key of "source" set to "sequelize".
 * @type {Object}
 */
const sequelizeLogger = logger.child({ source: 'sequelize' })

/**
 * Sequelize instance, initialized to the database connection defined in the
 * application `models.db` configuration object.
 *
 * @see http://docs.sequelizejs.com/en/v3/api/sequelize/
 * @type {Sequelize}
 */
const sequelize = new Sequelize(config.database, config.username, config.password,
  Object.assign({
    logging: (...args) => {
      // write sequelize logs to the module log at the trace option
      // logging can be disabled completeley by setting `logging: false` in the
      // database configuration options
      if (sequelizeLogger.trace()) {
        sequelizeLogger.trace(...args)
      }
    }
  }, config.options))

/**
 * Initialized Sequelize models, loaded from the ./models directory.
 *
 * Each key is the name of the model (first letter is capitalized), and the
 * value is the initialized Sequelize Model definition.
 *
 * @see http://docs.sequelizejs.com/en/v3/api/model/
 * @type {Object}
 */
const models = definitions.init(sequelize, {
  timestamps: true,
  paranoid: false,
  underscored: true
})

export default models
export { sequelize }
