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

  return Object.keys(data).reduce((last, property) => {
    const spec = mapping[property]
    const column = spec ? spec.column : null

    if (!column) {
      return last
    }

    return Object.assign(last, { [column]: data[property] })
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
