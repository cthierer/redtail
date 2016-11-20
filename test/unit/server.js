/**
 * @module redtail/test/unit/index
 */

import expect from '../expect'
import app from '../../src/server'

describe('app entry point', () => {
  it('exists', () => expect(app).to.exist)
})
