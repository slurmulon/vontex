// @see: https://github.com/vuejs/vuex/blob/dev/test/unit/helpers.spec.js

import Vue from 'vue'
import Vuex from 'vuex'
import ContextStore from '../../../lib/store'
import { resolveNamespace } from '../../../lib/helpers'
import { expect } from 'chai'

Vue.use(Vuex)

describe('helpers', () => {
  describe('mapState', () => {
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

    const vm = new Vue({
      store,
      context ({ mapState }) {
        return {
          computed: mapState('foo', ['selected'])
        }
      }
    })

    it('still works as a native Vuex store', () => {
      expect(vm.selected).to.equal(1)
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
