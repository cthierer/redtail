
import sinon from 'sinon'
import config from 'config'
import expect from '../../../expect'
import * as http from '../../../../src/modules/data/http'
import * as transformer from '../../../../src/modules/transformer'

describe('neighborhoods.populate', () => {
  const sandbox = sinon.sandbox.create()
  const Neighborhood = { build: sandbox.stub().returns(Promise.resolve()) }
  const configData = { remote: { url: 'http://www.example.com' }, mapping: { foo: { column: 'bar' } } }
  let populate

  beforeEach(() => {
    sandbox.stub(http, 'getDataAsJSON').returns(Promise.resolve([]))
    sandbox.stub(transformer, 'transformAll').returns(Promise.resolve([]))
    sandbox.stub(config, 'get').withArgs('neighborhoods.populate').returns(configData)

    // need to require here, after config has been stubbed
    populate = require('../../../../src/modules/neighborhoods/populate').default // eslint-disable-line global-require
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('pulls data from the remote source', () =>
    expect(populate({ Neighborhood })).to.eventually.be.fulfilled
      .then(() => {
        expect(http.getDataAsJSON).to.have.been.caledOnce
        expect(http.getDataAsJSON).to.have.been.calledWith(configData.remote)
      }))

  it('transforms the retrieved data', () => {
    const rawData = [{ foo: 'bar' }]
    http.getDataAsJSON.returns(Promise.resolve(rawData))
    return expect(populate({ Neighborhood })).to.eventually.be.fulfilled
      .then(() => {
        expect(transformer.transformAll).to.have.been.calledOnce
        expect(transformer.transformAll).to.have.been.calledWith(rawData, configData.mapping)
      })
  })

  it('builds and saves a model from the transformed data', () => {
    const transformed = { bar: 'bar' }
    const instance = Object.assign({ save: sinon.stub().returns(Promise.resolve()) }, transformed)

    transformer.transformAll.returns(Promise.resolve([transformed]))
    Neighborhood.build.returns(instance)

    return expect(populate({ Neighborhood })).to.eventually.be.fulfilled
      .then(() => {
        expect(Neighborhood.build).to.have.been.calledOnce
        expect(Neighborhood.build).to.have.been.calledWith(transformed)
        expect(instance.save).to.have.been.calledOnce
      })
  })

  it('returns the saved model instance', () => {
    const transformed = { bar: 'bar' }
    const saved = Object.assign({ id: Math.random() }, transformed)
    const instance = Object.assign({
      save: sinon.stub().returns(Promise.resolve(saved))
    }, transformed)

    transformer.transformAll.returns(Promise.resolve([transformed]))
    Neighborhood.build.returns(instance)

    return expect(populate({ Neighborhood })).to.eventually.be.an('array')
      .and.to.have.members([saved])
  })

  it('handles when the Neighborhood model is not available', () =>
    expect(populate({})).to.eventually.be.an('array').that.is.empty)
})
