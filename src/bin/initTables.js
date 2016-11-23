/* eslint-disable no-console */

/**
 * @module redtail/bin/initTables
 */

import { sequelize } from '../modules/models'

sequelize.sync({ force: true })
  .then(() => {
    console.log('done initializing database tables')
  })
  .catch((err) => {
    console.error(err)
  })
