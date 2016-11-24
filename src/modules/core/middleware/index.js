/**
 * @module redtail/modules/core/middleware
 */

import generateId from './generate-id'
import initContext from './init-context'
import initLogger from './init-logger'
import handleError from './handle-error'
import recordResponse from './record-response'
import sendResult from './send-result'

export {
  generateId,
  initContext,
  initLogger,
  handleError,
  recordResponse,
  sendResult
}
