/* eslint-disable no-console */

import mysql from 'mysql'
import config from 'config'
import fs from 'fs'
import path from 'path'

const dbConfig = config.get('models.db')
const connection = mysql.createConnection({
  host: dbConfig.options.host,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.options.port,
  multipleStatements: true
})
const fileName = process.argv[2]

if (!fileName) {
  throw new Error('missing required parameter: filename')
}

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
