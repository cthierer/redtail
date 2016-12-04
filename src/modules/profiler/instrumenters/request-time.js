/**
 * @module redtail/modules/profiler/instrumenters/requestTime
 */

import EventEmitter from 'events'
import Router from 'express/lib/router'
import { wrap } from '../utils/functions'

/**
 * The profile key for tracking total time elapsed for a request.
 * @type {string}
 */
const REQUEST_TIME = 'requestTime.elapsed'

/**
 * Load the instrumentation to track the total amount of time it takes to
 * process a request.
 * @returns {function} A function that should be called during a request,
 *  taking in the request object and the profile.
 */
function requestTime() {
  const timer = new EventEmitter()

  // wrap the Express Router handle function to record the time before and
  // after the chain was fired
  function trackTime(_handle, req, res, out) {
    const tag = req.__tag
    const startTime = process.hrtime()

    function next(...args) {
      const elapsedTime = process.hrtime(startTime)
      timer.emit(tag, elapsedTime)
      return out(...args)
    }

    return _handle.call(this, req, res, next)
  }

  wrap(Router, 'handle', trackTime)

  return (req, profile) => {
    // listen for the time elapsed to be calculated for this request, and
    // set it on the profile
    timer.once(req.__tag, (elapsedTime) => {
      profile.set(REQUEST_TIME, elapsedTime)
    })
  }
}

export default requestTime
export { REQUEST_TIME }
