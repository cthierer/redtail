/**
 * @module redtail/modules/core/middleware
 */

import count from './count'
import create from './create'
import list from './list'
import generateId from './generate-id'
import getById from './get-by-id'
import initContext from './init-context'
import initLogger from './init-logger'
import handleError from './handle-error'
import recordResponse from './record-response'
import sendResult from './send-result'
import update from './update'
import remove from './remove'

export {
  count,
  create,
  list,
  generateId,
  getById,
  initContext,
  initLogger,
  handleError,
  recordResponse,
  sendResult,
  update,
  remove
}
