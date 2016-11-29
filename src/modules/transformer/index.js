/**
 * @module redtail/modules/transformer
 */

/**
 * Transform data using the provided mapping.
 *
 * The mapping defines how the data is to be transformed. Each key in the
 * mapping object is the name of one of the attributes from data, and each
 * value is an object that defines how the attribute should be transformed.
 * At a minimum, the mapping value should define a `column` attribute, which
 * defines the destination attribute.
 *
 * If the mapping defines that a column should reference another model,
 * then the reference mapping is added to an array of expected reference
 * types. For example, all belongsTo references will be in the
 * `result._belongsTo` array. These references must be resolved by the consumer
 * of this function.
 *
 * @example
 * const data = { foo: true }
 * const mapping = { foo: { column: 'bar' } }
 * await transform(data, mapping)
 * // results in { bar: true }
 *
 * @param {Object} data The source data object to transform.
 * @param {Object} mapping The mapping specifications to generate the
 *  destination object.
 * @returns {Object} The transformed object.
 */
async function transform(data, mapping) {
  if (!data || !mapping) {
    return {}
  }

  return Object.keys(mapping).reduce((last, property) => {
    const spec = mapping[property]
    const column = spec ? spec.column : null
    const value = data[property] || spec.default

    if (!column || !value) {
      return last
    }

    // TODO rewrite to be more functional style
    // TODO support other reference types
    if (spec.ref === 'belongsTo' && spec.model) {
      const updated = last._belongsTo
        ? last
        : Object.assign(last, { _belongsTo: [] })

      updated._belongsTo.push({
        model: spec.model,
        create: spec.create === true,
        column,
        value
      })

      return updated
    }

    return Object.assign(last, { [column]: value })
  }, {})
}

/**
 * Transform mulitple data objects using the mapping.
 * @param {Object[]} data Collection of data objects to transform.
 * @param {Object} mapping The mapping specifications to generate the
 *  destination object (see {@link transform} for more details).
 * @returns {Object[]} Collection of transformed objects. Objects that could not
 *  be transformed are ommitted.
 */
async function transformAll(data, mapping) {
  if (!data || !data.length) {
    return []
  }

  return Promise.all(data.map(datum => transform(datum, mapping)))
    .then(transformed => transformed.reduce((last, obj) => {
      if (obj && Object.keys(obj).length > 0) {
        return last.concat(obj)
      }
      return last
    }, []))
}

export { transform, transformAll }
