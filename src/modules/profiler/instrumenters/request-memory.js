/**
 * @module redtail/profiler/instrumenters/requestMemory
 */

import EventEmitter from 'events'
import Router from 'express/lib/router'
import Layer from 'express/lib/router/layer'
import { wrap } from '../utils/functions'

/**
 * The profile key for the total memory calculated.
 * @type {string}
 */
const REQUEST_MEMORY = 'requestMemory.total'

/**
 * Calculate the difference between two memory profile objects.
 * @returns {object} Matches the format of the memory profile object, but
 *  each attribute is the difference between the value for before and after.
 */
function diffMemoryProfiles(before, after) {
  return Object.keys(after).reduce((totals, key) =>
    Object.assign(totals, { [key]: (after[key] || 0) - (before[key] || 0) }), {})
}

/**
 * Load the instrumenter to track the amount of memory used during a request.
 *
 * This function is imperfect, but attempts to estimate the amount of memory
 * used for a particular request.
 *
 * To estimate the amount of memory used for a single request (and not any
 * other requests that might be processed concurrently), the philsophy is to:
 *  1.  Wrap each middleware function in a handler than calculates the memory
 *      usage for just that middleware.
 *  2.  Wrap the entire middleware chain in a function that sums up the
 *      memory usage for each link in the middleware chain (calculated in 1).
 *
 * Since middleware can be asynchronous, this attempts to factor in the
 * memory used before the asynchronous I/O event, and after the asynchronous
 * I/O event returns.
 *
 * @returns {function} A function that should be called during a request,
 *  taking in the request object and the profile.
 * @todo Improve estimation of memory usage.
 */
function requestMemory() {
  const recorder = new EventEmitter() // fire events when a new usage is calcualted
  const totaler = new EventEmitter()  // fire events when a total is calculated

  // calculate the total memory used by each function in the middleware chain.
  function totalMemory(_handle, req, res, out) {
    const tag = req.__tag
    const total = {}

    function next(...args) {
      totaler.emit(tag, total)  // done calculating memory usage
      return out(...args)
    }

    // listen for memory usage from each middleware fired in the chain
    recorder.on(tag, (diff) => {
      Object.keys(diff).reduce((totals, key) => {
        const value = diff[key] || 0

        // ignore values less than zero - these would indicate that garbage
        // collection occurred, and the memory _after_ the middleware executed
        // is now less than the memory _before_ the middleware was executed.
        // since garbage collection is a global process, it's not possible to
        // determine what the impact was to this one request. therefore,
        // just ignoring - better to over-report memory usage than under report.
        if (value < 0) {
          return totals
        }

        // add the value to the total
        return Object.assign(totals, { [key]: (total[key] || 0) + value })
      }, total)
    })

    return _handle.call(this, req, res, next)
  }

  // calculate the amount of usage for a single middleware function
  function calcUsage(_handleRequest, req, res, _next) {
    const tag = req.__tag
    const memBefore = process.memoryUsage() // memory before middleware calculated
    let memLast = memBefore                 // last memory amount checked
    let nextCalled = false                  // has the next() fn been called?
    const waitFor = setImmediate(() => {
      /*
       * Each time the event loop loops, get the memory usage at the top of the
       * loop. This is to attempt to estimate the amount of memory used by
       * an asynchronous I/O operation that spans multiple loops.
       */
      memLast = process.memoryUsage()
    })

    function next(...args) {
      const memAfter = process.memoryUsage()
      const diff = diffMemoryProfiles(memLast, memAfter)

      nextCalled = true         // next has been called
      recorder.emit(tag, diff)  // done calculating memory usage for this fn
      clearImmediate(waitFor)   // don't keep firing the immediate function

      return _next(...args)
    }

    // store the result of the actual request call
    const result = _handleRequest.call(this, req, res, next)

    // see how much memory has been used after the function call
    memLast = process.memoryUsage()

    // if the function call is synchronous, than the next function would have
    // been invoked _before_ the return value was returned - memory would have
    // already been calculated, so just ignore.
    // otherwise, calculate how much memory was used by this initial call,
    // and let the next handler handle how much memory was used during the
    // asynchronous callback
    if (!nextCalled) {
      const diff = diffMemoryProfiles(memBefore, memLast)
      recorder.emit(tag, diff)
    }

    return result
  }

  wrap(Router, 'handle', totalMemory)
  wrap(Layer.prototype, 'handle_request', calcUsage)

  return (req, profile) => {
    // listen for the total memory to be calculated for this request, and
    // set it on the profile
    totaler.once(req.__tag, (memoryProfile) => {
      profile.set(REQUEST_MEMORY, memoryProfile)
    })
  }
}

export default requestMemory
export { REQUEST_MEMORY }
