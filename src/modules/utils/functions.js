/**
 * @module redtail/modules/utils/functions
 */

/**
 * Pre-empt a function call, providing part of the parameters that should be
 * passed to the actual function call.
 * @param {function} fn The function call to partially populate.
 * @param {...any} partials The arguments to pass to the function call when
 *  it is invoked.
 * @returns {function} A function call that when invoked, invokes the fn
 *  parameter, passing in the partials arguments, plus any arguments passed
 *  into the actual function call.
 */
function partial(fn, ...partials) {
  return (...remaining) => fn(...partials, ...remaining)
}

export default { partial }
export { partial }
