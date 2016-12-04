/**
 * @module redtail/modules/profiler/utils/functions
 */

/**
 * Wrap a methdon on an object to fire another handler.
 * @param {object} object The object to wrap.
 * @param {string} methodName The name of the method to wrap.
 * @param {function} handler The handler to call in place of the original
 *  method. The handler takes in the original method as the first argument,
 *  followed by all of the arguments originally passed to the method call.
 *  The handler is bound to the original method's execution context.
 */
function wrap(object, methodName, handler) {
  const _method = object[methodName]

  function method(...args) {
    return handler.call(this, _method, ...args)
  }

  object[methodName] = method
}

export default { wrap }
export { wrap }
