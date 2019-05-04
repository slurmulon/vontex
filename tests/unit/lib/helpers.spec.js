import { expect } from 'chai'
import { resolveNamespace } from '../../../lib/helpers'

describe('helpers', () => {
  describe('resolveNamespace', () => {
    const withSelected = {
      state: {
        foo: {
          selected: 123,
          123: {
            bar: {
              selected: 456
            }
          }
        }
      },

      getters: {
        current: () => ({
          id: 123
        })
      }
    }

    // const withCurrent = {

    // }

    it('resolves paths containing wildcards using selected entities', () => {
      const result = resolveNamespace('foo/*/bar', withSelected)
      const expected = 'foo/123/bar'

      expect(result).to.equal(expected)
    })

    it('resolves paths containing wildcards using current entities', () => {

    })

    it('throws an exception when no selected or current entity can be resolved from a wildcard', () => {

    })
  })
})
