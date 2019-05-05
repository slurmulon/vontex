import mixin from './mixin'
import Vuex from 'vuex'
import empty from 'is-empty'

// Bind on install
let Vue

// Instantiated on first ContextStore instantiation
// let rootStore

// const rootStore = new Vuex({ namespaced: true
// })

// Manages a collection of nested entity instance modules
// FIXME: Ensure Vue.use(Vuex) has been called
export default function ({
  namespace, // TODO: try to eliminate the need for this, determine dynamically
  state,
  mutations,
  actions,
  getters,
  modules,
  init = state => !empty(state.all) && state.all[0]
}) {
  // if (!Vue && typeof window !== 'undefined' && window.Vue) {
  //   install(window.Vue)
  // }

  // MADHAX: Remove this
  install(require('vue').default)

  // if (!rootStore) {
  //   rootStore = new Vuex({
  //     namespaced: true
  //   })
  // }

  const options = {
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
        const { all, selected } = this

        if (!empty(selected)) {
          return selected
        } else if (!empty(all)) {
          return init(state)
        }
      },

      ...getters
    },

    modules: {
      ...modules
    }
  }

  // const store = rootStore.registerModule(namespace, options)

  // FIXME: Need to establish / manage  a root module
  //  - Might have to use registerModule there
  const store = new Vuex.Store(options)

  return store
}

export function install (_Vue) {
  console.log('INSTALLING CONTEXT VUEX')
  // if (Vue && _Vue === Vue) {
  //   if (process.env.NODE_ENV !== 'production') {
  //     console.error(
  //       '[vuex] already installed. Vue.use(Vuex) should be called only once.'
  //     )
  //   }
  //   return
  // }

  Vue = _Vue

  Vue.use(Vuex)

  mixin(Vue)
}
