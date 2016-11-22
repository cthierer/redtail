/**
 * @module redtail/bin/initTables
 */

import { sequelize } from '../modules/db'

sequelize.sync({ force: true })
