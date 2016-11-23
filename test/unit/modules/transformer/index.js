
import expect from '../../../expect'
import * as transformer from '../../../../src/modules/transformer'

describe('transformer', () => {
  describe('.transform', () => {
    it('maps values from source to destination using `mapping.column`', () => {
      const data = { foo: Math.random() }
      const mapping = { foo: { column: 'bar' } }
      return expect(transformer.transform(data, mapping)).to.eventually
        .be.an('object')
        .with.property('bar', data.foo)
    })

    it('ignores values with no `column` definition in the mapping', () => {
      const data = { foo: Math.random() }
      const mapping = { foo: {} }
      return expect(transformer.transform(data, mapping)).to.eventually
        .be.an('object')
        .that.is.empty
    })

    it('ignores values that do not have a mapping', () => {
      const data = { foo: Math.random() }
      const mapping = {}
      return expect(transformer.transform(data, mapping)).to.eventually
        .be.an('object')
        .that.is.empty
    })

    it('returns an empty object if data is not defined', () =>
       expect(transformer.transform()).to.eventually
        .be.an('object')
        .that.is.empty)

    it('returns an empty object if mapping is not defined', () => {
      const data = { foo: Math.random() }
      return expect(transformer.transform(data)).to.eventually
        .be.an('object')
        .that.is.empty
    })
  })

  describe('.transformAll', () => {
    it('maps an array of objects using the mapping', () => {
      const data = [{ foo: Math.random() }, { foo: Math.random() }]
      const mapping = { foo: { column: 'bar' } }
      return expect(transformer.transformAll(data, mapping)).to.eventually
        .be.an('array')
        .that.has.length(2)
        .then((transformed) => {
          // validate that every element in `data` (the source)
          // has been transformed into `transformed` (the destination)
          expect(data.every(srcObj => transformed.find(
            destObj => destObj.bar === srcObj.foo) !== null)).to.be.true
        })
    })

    it('returns an empty array if data is empty', () => {
      const data = []
      return expect(transformer.transformAll(data, {})).to.eventually
        .be.an('array')
        .that.is.empty
    })

    it('returns an empty array if data is not an array', () => {
      const data = {}
      return expect(transformer.transformAll(data, {})).to.eventually
        .be.an('array')
        .that.is.empty
    })

    it('ignores objects that could not be transformed', () => {
      const data = { foo: Math.random() }
      const mapping = { bar: { column: 'foo' } }
      return expect(transformer.transformAll([data], mapping)).to.eventually
        .be.an('array')
        .that.is.empty
    })
  })
})
