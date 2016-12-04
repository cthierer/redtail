/**
 * @module redtail/modules/logger
 */

import bunyan from 'bunyan'
import Config from 'config'

/**
 * Check if the logger should be muted (i.e., no logs shoudl be written to
 * stdout). Can be set from a global `muteLogger` variable, or from
 * an environment variable "MUTE_LOGGER".
 * @type {boolean}
 */
const MUTED = global.muteLogger || process.env.MUTE_LOGGER || false

/**
 * Key for disabling loging.
 * @type {integer}
 */
const OFF = bunyan.FATAL + 1

/**
 * The application-wide logger configuration. Loaded from the `logger`
 * configuration key.
 * @type {object}
 */
const globalConfig = Object.assign({}, Config.get('logger'))

if (MUTED) {
  // disable logging
  globalConfig.level = OFF
  globalConfig.streams = []
} else if (globalConfig.streams) {
  // always go to stdout
  // can't specify this in JSON config file
  globalConfig.streams.push({
    stream: process.stdout
  })
}

/**
 * Load the logging configuration for the specified module. If no configuration
 * exists, then return an empty object. Module logger configurations should
 * be under the `logger` key of the module configuration.
 * @param {string} module The name of the module to load the logging
 *  configuration for.
 * @returns {object} The logging configuration.
 */
function getConfigForModule(module) {
  const configStr = `${module}.logger`

  if (!Config.has(configStr)) {
    return {}
  }

  return Config.get(configStr)
}

/**
 * Retrieve a logger for the specified module, identified by the `name`
 * parameter.
 *
 * The logger will be initialized to include all global and module logger
 * configuration values. The module configuration will override the global
 * configuration in the case that there is a conflict between the two
 * configurations.
 *
 * @param {string} name The name of the module to load the logger for.
 * @returns {object} The intialized loggers. Loggers follow the interface
 *  exposed by the bunyan module.
 * @see https://github.com/trentm/node-bunyan#log-method-api
 */
function get(name) {
  const loggerOptions = Object.assign({},
    globalConfig,             // global configuration options
    getConfigForModule(name), // override the default with module-specific
    { name }                  // always set the name to be the name passed in
  )

  return bunyan.createLogger(loggerOptions)
}

export default get
export { get }
