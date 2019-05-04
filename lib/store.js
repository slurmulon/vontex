import Vuex from 'vuex'
import empty from 'is-empty'

// Manages a collection of entity instance modules
// TODO: Replicate `api/resources` in Jelli
export default function ({
  namespace, // TODO: try to eliminate the need for this, determine dynamically
  state,
  mutations,
  actions,
  getters,
  modules,
  init = state => !empty(state.all) && state.all[0]
}) {
  const store = new Vuex.Store({
    namespaced: true,

    state () {
      return {
        all: [],
        selected: null,
        ...state
      }
    },

    mutations: {
      select (state, entity) {
        state.selected = entity
      },

      clear (state) {
        state.selected = null
      },

      create (state, entity) {
        state.all.push(entity)

        // TODO: Probably call register in `entity` from here
        // TODO: How does `store` get populated here?

        store.registerModule([namespace, entity.id], entity)
      },

      delete (state, entity) {
        // TODO: Slice out the entity from `state.all`
        // TODO: Probably call unregister in `entity` from here

        store.unregisterModule([namespace, entity.id])
      },

      // TODO: Make this an action instead, call `destroy` for each entity in `all`
      reset (state) {
        state.all = []
        state.selected = null
      },

      ...mutations
    },

    actions: {
      ...actions
    },

    getters: {
      current: state => {

      },

      ...getters
    },

    modules: {
      ...modules
    }
  })

  return store
}
