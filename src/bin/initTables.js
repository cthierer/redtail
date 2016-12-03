/* eslint-disable no-console */

/**
 * Synchronize the application data models with the database, using the
 * database configuration for the current environment. This overwrites any
 * existing tables in the database.
 *
 * @example
 * node initTables
 *
 * @module redtail/bin/initTables
 */

import { sequelize } from '../modules/models'

sequelize.sync({ force: true })
  .then(() => {
    console.log('done initializing database tables')
    sequelize.close()
  })
  .catch((err) => {
    console.error(err)
    sequelize.close()
  })
