import mixin from './mixin'
import Vuex from 'vuex'
import empty from 'is-empty'

// Bind on install
let Vue

// Instantiated on first ContextStore instantiation
// TODO: Potentially allow this to be provided to constructor
let rootStore

// Manages a collection of nested entity instance modules
// FIXME: Ensure Vue.use(Vuex) has been called
export default function ({
  namespace, // TODO: try to eliminate the need for this, determine dynamically
  state,
  mutations,
  actions,
  getters,
  // TODO: Will probably have to parse `modules` as `ContextStore`
  modules,
  init = state => !empty(state.all) && state.all[0]
}) {
  // if (!Vue && typeof window !== 'undefined' && window.Vue) {
  //   install(window.Vue)
  // }

  // MADHAX: Remove this
  install(require('vue').default)

  if (!rootStore) {
    rootStore = new Vuex.Store({ namespaced: true })
  }

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

      // FIXME: Entity needs to be modularized
      create (state, entity) {
        state.all.push(entity)

        // TODO: Probably call register in `entity` from here
        // TODO: How does `store` get populated here?

        rootStore.registerModule([namespace, entity.id], entity)
      },

      // FIXME: Entity needs to be modularized
      delete (state, entity) {
        // TODO: Slice out the entity from `state.all`
        // TODO: Determine how to deal with deeply nested modules (beyond 2 levels)
        // TODO: Probably call unregister in `entity` from here

        rootStore.unregisterModule([namespace, entity.id])
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
    }
  }

  rootStore.registerModule(namespace, options)

  // Register initially selected instance as a submodule if it's defined
  if (state.selected != null) {
    rootStore.registerModule([namespace, state.selected], { namespaced: true })
  }

  // Register initially provided modules dynamically instead of statically
  if (typeof modules === 'object') {
    const parentNamespace = state.selected != null ? [namespace, state.selected] : [namespace]

    registerChildModules(parentNamespace, modules)
  }

  return rootStore
}

// TODO: Also register any initially provided `selected` entities in the module's `state`
// TODO: Verify that any defined child `modules` adhere to the `selected`/`all` format
// TODO: Also ensure this gets called again whenever the parentNamespace's selected entity changes
// TODO: Consider renaming to `registerInstanceModules`
export function registerChildModules (parentNamespace, modules) {
  if (!Array.isArray(parentNamespace)) {
    parentNamespace = [parentNamespace]
  }

  for (const namespace in modules) {
    const childModule = { ...modules[namespace], namespaced: true }
    const absoluteNamespace = [...parentNamespace, namespace]

    rootStore.registerModule(absoluteNamespace, childModule)
  }
}

export function install (_Vue) {
  // if (Vue && _Vue === Vue) {
  //   if (process.env.NODE_ENV !== 'production') {
  //     console.error(
  //       '[vucontex] already installed. Vue.use(Vucontex) should be called only once.'
  //     )
  //   }
  //   return
  // }

  Vue = _Vue

  Vue.use(Vuex)

  mixin(Vue)
}
