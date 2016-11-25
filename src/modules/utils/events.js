/**
 * @module redtail/modules/utils/events
 */

/**
 * Fire an action on any event emitted by the emitter.
 * @param {EventEmitter} emitter The event emitter to intercept events from.
 * @param {function} action The action to fire for every intercepted event.
 */
function onAny(emitter, action) {
  const fireEmit = emitter.emit.bind(emitter)
  emitter.emit = (name, ...args) => {
    action(name, ...args)
    fireEmit(name, ...args)
  }
}

/**
 * Propagate all fired actions from the fromEmitter to the toEmitter.
 * Any event fired by fromEmitter will be mirrored on toEmitter.
 * @param {EventEmitter} fromEmitter The emitter firing events to propagate.
 * @param {EventEmitter} toEmitter The emitter to propagate events to.
 */
function propagate(fromEmitter, toEmitter) {
  onAny(fromEmitter, (...args) => toEmitter.emit(...args))
}

export { onAny, propagate }
