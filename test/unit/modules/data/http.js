
import sinon from 'sinon'
import * as popsicle from 'popsicle'
import expect from '../../../expect'
import * as http from '../../../../src/modules/data/http'

describe('http', () => {
  const sandbox = sinon.sandbox.create()

  afterEach(() => {
    sandbox.restore()
  })

  describe('getRequestAsJSON', () => {
    let response

    beforeEach(() => {
      response = { status: 200 }
      sandbox.stub(popsicle, 'request').returns(Object.assign(Promise.resolve(response), {
        use: sandbox.stub().returnsThis()
      }))
    })

    it('makes a HTTP request using the provided options', () => {
      const options = { url: 'http://www.example.com' }
      return expect(http.getDataAsJSON(options)).to.eventually.be.fulfilled
        .then(() => {
          expect(popsicle.request).to.have.been.calledOnce
          expect(popsicle.request).to.have.been.calledWith(sinon.match(options))
        })
    })

    it('always sets the accept header to "application/json"', () => {
      const options = { url: 'http://www.example.com' }
      return expect(http.getDataAsJSON(options)).to.eventually.be.fulfilled
        .then(() => {
          expect(popsicle.request).to.have.been.calledWith(sinon.match({
            headers: { accept: 'application/json' }
          }))
        })
    })

    it('returns the body (which is already parsed by popsicle)', () => {
      const options = { url: 'http://www.example.com' }
      const expected = { foo: 'bar' }

      response.body = expected

      return expect(http.getDataAsJSON(options)).to.eventually.deep.equal(expected)
    })

    it('is rejected when the status code is >= 400', () => {
      const options = { url: 'http://www.example.com' }
      response.status = 400
      return expect(http.getDataAsJSON(options)).to.eventually.be.rejected
    })

    it('is rejected when the url is not defined', () => {
      const options = {}
      return expect(http.getDataAsJSON(options)).to.eventually.be.rejected
    })
  })
})
