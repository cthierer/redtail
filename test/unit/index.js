
import expect from '../expect'
import app from '../../src'

describe('app entry point', () => {
  it('exists', () => expect(app).to.exist)
  it('has a server', () => expect(app).to.have.property('server'))
})
