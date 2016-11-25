/**
 * @module redtail/modules/utils/urls
 */

/**
 * Join multiple URL strings together, ensuring that they are separated
 * by path separators appropriatly.
 * @param {...string} paths The paths to join together.
 * @returns {string} The joined paths.
 */
function join(...paths) {
  return paths.reduce((last, path) => {
    const base = last[last.length - 1] === '/' ? last.substr(0, last.length - 1) : last
    const next = path[0] === '/' ? path.substring(1, path.length) : path
    return `${base}/${next}`
  })
}

export default { join }
export { join }
