
import Promise from 'bluebird'
import Sequelize from 'sequelize'
import * as http from '../data/http'
import * as transformer from '../transformer'
import * as utils from '../utils'
import * as Logger from '../logger'

const logger = Logger.get('core/populate')

/**
 * Represent an error where a referenced model instance could not be found
 * based on the reference condition.
 * @class
 * @extends {Error}
 */
class MissingReferenceError extends Error {
  /**
   * @constructor
   * @param {string} model The name of the model that could not be referenced.
   * @param {string} column The column from the Model table used for the
   *  reference.
   * @param {string} value The value that was matched on.
   */
  constructor(model, column, value) {
    super(`Unable to find referenced ${model}: ${column}="${value}"`)

    /**
     * The name of the model that could not be referenced.
     * @type {string}
     */
    this.model = model

    /**
     * The column from the Model table used for the reference.
     * @type {string}
     */
    this.column = column

    /**
     * The value that was matched on.
     * @type {string}
     */
    this.value = value
  }
}

/**
 * Load the "belongsTo" model instances. If no model instance is found, and
 * `definition.create` is true, then create a new instance for the specified
 * model; otherwise, thrown an error.
 * @param {object} models The loaded application models.
 * @param {object} definition The belongsTo definition generated by
 *  {@link transform}.
 * @returns {Instance} The model instance for the referenced data.
 * @throws {MissingReferenceError} Thrown when a required reference could not
 *  be found.
 */
async function findBelongsTo(models, definition) {
  const model = models[definition.model]
  const filter = { where: { [definition.column]: definition.value } }

  if (definition.create) {
    return model.findOrCreate(filter).spread(instance => instance)
  }

  return model.findOne(filter)
    .then((instance) => {
      if (!instance) {
        throw new MissingReferenceError(definition.model, definition.column, definition.value)
      }
      return instance
    })
}

/**
 * Load references to related models.
 *
 * Data from a remote source may be "normalized" into a relational database
 * structure with data from other sources. These references are defined in
 * the mapping configuration, and loaded by this function. If an existing
 * reference is not defined, _and_ `data.create` is set to `true`, then
 * a new model instance will be created for the reference. Otherwise, an error
 * is thrown.
 *
 * @param {object} models The collection of data models.
 * @param {object} data The transformed data object, generated from
 *  {@link transform}.
 * @returns {array} Collection of reference instances loaded from the models.
 * @throws {MissingReferenceError} Thrown if a reference is required, but could
 *  not be found.
 * @todo Support other relationship models other than "belongsTo".
 */
async function findRelated(models, data) {
  const belongsTo = data._belongsTo || []
  return Promise.map(belongsTo, utils.functions.partial(findBelongsTo, models))
}

/**
 * Retrieve data from a remote source, transform it into a format consumable
 * by this application, and persist it.
 * @param {object} config The populate configuration.
 * @param {object} config.remote Details about the HTTP request to retrieve the
 *  data from the remote source. Should match the format expected by the
 *  popsicle module.
 * @param {object} config.mapping Used to transform data from the remote
 *  service to application models using the {@link transform} function.
 * @param {Model} coreModel The "main" Sequelize Model used to populate data
 *  from the remote source.
 * @param {object} models References to other application models that may be
 *  related to the coreModel.
 * @returns {array} Collection of all saved instances.
 * @see https://github.com/blakeembrey/popsicle#handling-requests
 * @see http://docs.sequelizejs.com/en/v3/api/model/
 * @see http://docs.sequelizejs.com/en/v3/api/instance/
 */
async function populate(config, coreModel, models) {
  const modelName = coreModel.name
  const raw = await http.getDataAsJSON(config.remote)

  const created = await Promise.map(raw, async (data) => {
    const transformed = await transformer.transform(data, config.mapping)
    // if updated at is already set, then don't set it now; set silent to true
    const silent = transformed.updated_at !== null && transformed.updated_at !== undefined

    try {
      const related = await findRelated(models, transformed)
      // at this point, we have everything we need to build the model - build it
      // use `slient: true` to suppress updating updatedAt field
      const instance = await coreModel.build(transformed).save({ silent })
      // update all of the relationships
      // TODO the `add${modelName}` fn will only exist for belongsTo relationships
      await Promise.all(related.map(other => other[`add${modelName}`](instance, { silent: true })))
      // model is complete
      return instance
    } catch (err) {
      // ignore error, and move onto the next one
      if (err instanceof MissingReferenceError || err instanceof Sequelize.ValidationError) {
        // could not find an expected reference, or data failed validation
        // not unexpected, due to inconsistencies with the data
        // going to ignore, but log in case we need to debug later
        if (logger.debug()) {
          logger.debug({ err }, err.message)
        }
      } else if (logger.warn()) {
        // something unexpected happened log the error for future inspection
        logger.warn({ err }, 'encountered error while propulating:', err.message)
      }
    }

    // no instance saved
    return null
  })

  // elminate falsey values from the result set
  return created.reduce((complete, instance) => {
    if (instance) {
      return complete.concat(instance)
    }
    return complete
  }, [])
}

export default { populate }
export { populate }