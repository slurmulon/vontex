// @see: https://github.com/vuejs/vuex/blob/dev/test/unit/helpers.spec.js

import Vue from 'vue'
import ContextStore from '../../../lib/store'
import { resolveNamespace } from '../../../lib/helpers'
import { expect } from 'chai'

describe('helpers', () => {
  describe('mapState', () => {
    it('still works as a native Vuex store', () => {
      const store = new ContextStore({
        namespace: 'foo',
        state: {
          all: [
            { id: 1, name: 'a' },
            { id: 2, name: 'b' }
          ],

          selected: 1
        }
      })

      // TODO

      const vm = new Vue({
        store,
        context: ({ mapState }) => ({
          computed: mapState('foo', ['selected'])
        })
      })

      expect(vm.selected).to.equal(1)

      store.unregisterModule('foo')
    })

    it('works with nested contextual entities', () => {
      const store = new ContextStore({
        namespace: 'foo',
        state: {
          all: [
            { id: 1, name: 'a' },
            { id: 2, name: 'b' }
          ],

          selected: 1
        },
        modules: {
          bar: {
            state: {
              all: [
                { id: 3, name: 'c' },
                { id: 4, name: 'd' }
              ],

              selected: 4
            }
          }
        }
      })

      const vm = new Vue({
        store,
        context: ({ mapState }) => ({
          computed: mapState('foo/*/bar', ['selected'])
        })
      })

      expect(vm.selected).to.equal(4)

      // store.unregisterModule('foo')
    })
  })

  describe('resolveNamespace', () => {
    const withSelected = {
      state: {
        foo: {
          selected: 123
        }
      },

      getters: {
        current: () => ({
          id: 123
        })
      },

      modules: {
        123: {
          state: {
            bar: {
              selected: null
            }
          }
        }
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
