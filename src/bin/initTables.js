/* eslint-disable no-console */

/**
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
