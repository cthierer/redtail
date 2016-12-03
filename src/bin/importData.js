/* eslint-disable no-console */

/**
 * Run a SQL file against the database, using the database credentials. Invoked
 * with a single argument: the path and name of the SQL file to import.
 *
 * Uses the database configuration and credentials from the application
 * configuration for the current environment.
 *
 * @example
 * node importData ./sql/my-data.sql
 *
 * @module redtail/bin/importData
 */

import mysql from 'mysql'
import config from 'config'
import fs from 'fs'
import path from 'path'

const fileName = process.argv[2]
const dbConfig = config.get('models.db')
const connection = mysql.createConnection({
  host: dbConfig.options.host,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.options.port,
  multipleStatements: true
})

if (!fileName) {
  throw new Error('missing required parameter: filename')
}

/**
 * Import a SQL file contents into the database by passing it to the MySQL
 * connection.
 * @param {string} contents The SQL file to import.
 * @returns {Promise} Resolves when the operation is complete.
 */
async function importFile(contents) {
  return new Promise((resolve, reject) => {
    connection.query(contents.toString(), (err) => {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })
}

/**
 * Read a SQL file from disk.
 * @param {string} file The path to the file to read.
 * @returns {Promise} Resolves to the contents of the read file.
 */
async function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      resolve(data.toString())
    })
  })
}

readFile(path.resolve(fileName))
  .then(importFile)
  .then(() => {
    console.log('done')
    connection.end()
  })
  .catch((err) => {
    console.error(err)
    connection.end()
  })
