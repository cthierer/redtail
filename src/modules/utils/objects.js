/**
 * @module redtail/modules/utils/objects
 */

/**
 * Merge one object into another, and return the result. Unlike `Object.assign`,
 * this recursively navigates the object and merges child objects together,
 * rather than overwriting.
 * @param {object} into The destination object to merge into.
 * @param {object} from The source object to merge values from.
 * @returns {object} The result of merging `from` into `into`.
 */
function merge(into, from) {
  return Object.keys(from).reduce((last, fromKey) => {
    const value = from[fromKey]
    const curValue = into[fromKey]
    if (!curValue || typeof curValue !== 'object') {
      return Object.assign(last, { [fromKey]: value })
    }
    return Object.assign(last, { [fromKey]: merge(curValue, value) })
  }, Object.assign({}, into))
}

export default { merge }
export { merge }
