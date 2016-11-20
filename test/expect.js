/**
 * Configure chai to use common dependencies, and expose the "expect" assertion
 * method.
 *
 * Tests should import this module in-lieu of importing chai directly.
 *
 * @see http://chaijs.com/
 * @see https://github.com/domenic/chai-as-promised
 * @see https://github.com/domenic/sinon-chai
 *
 * @example
 * import expect from './expect'
 * const doAsync = () => return Promise.resolve(true)
 * expect(doAsync()).to.eventually.be.true
 *
 * @example
 * import { chai } from './expect'
 * const myObject = { value: true }
 * chai.expect(myObject).to.have.property('value', true)
 *
 * @module redtail/test/expect
 */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'

// support Promise-based asynchronous unit tests
chai.use(chaiAsPromised)

// support inspecting Sinon spies through chai
chai.use(sinonChai)

export default chai.expect
export { chai }
