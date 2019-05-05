import mixin from './mixin'
import Vuex from 'vuex'
import empty from 'is-empty'

// Bind on install
let Vue

// Instantiated on first ContextStore instantiation
// TODO: Potentially allow this to be provided to constructor
let rootStore

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
    rootStore = new Vuex.Store({
      namespaced: true
    })
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

      create (state, entity) {
        state.all.push(entity)

        // TODO: Probably call register in `entity` from here
        // TODO: How does `store` get populated here?

        rootStore.registerModule([namespace, entity.id], entity)
      },

      delete (state, entity) {
        // TODO: Slice out the entity from `state.all`
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
    },

    // TODO: Remove this. Needs to be handled dynamically instead.
    modules: {
      ...modules
    }
  }

  rootStore.registerModule(namespace, options)

  if (state.selected != null) {
    rootStore.registerModule([namespace, state.selected], { namespaced: true })
  }

  if (typeof modules === 'object') {
    console.log('!!! submodules yo', state.selected)
    const parentNamespace = state.selected != null ? [namespace, '' + state.selected] : [namespace]

    console.log('--- parentNamespace', parentNamespace)

    registerChildModules(parentNamespace, modules)
  }

  return rootStore

  // FIXME: Need to establish / manage  a root module
  //  - Might have to use registerModule there
  // const store = new Vuex.Store(options)

  // return store
}

export function registerChildModules (parentNamespace, modules) {
  console.log('PARENT NAMESPACE', parentNamespace)
  if (!Array.isArray(parentNamespace)) {
    parentNamespace = [parentNamespace]
  }

  // TODO: Iterate through modules (by `Object.key`) and call `rootStore.registerModule` for each
  // TODO: Also register any initially provided `selected` entities in the module's `state`
  // TODO: Also ensure this gets called again whenever the parentNamespace's selected entity changes
  // TODO: Consider renaming to `registerInstanceModules`
  for (const namespace in modules) {
    const childModule = { ...modules[namespace], namespaced: true }

    const absoluteNamespace = [...parentNamespace, namespace]
    // const absoluteNamespace = [parentNamespace.join('/'), namespace] // FAIL

    // console.log('REGISTING CHILD NAMESPACE', [...parentNamespace, namespace])
    console.log('REGISTING CHILD NAMESPACE', absoluteNamespace)
    console.log('REGISTERING parent MODULE', modules[namespace])
    console.log('REGISTERING CHILD MODULE', childModule)

    rootStore.registerModule(absoluteNamespace, childModule)

    console.log('DONE REGISTERING', rootStore._modules.root._children.foo._children)
    // console.log('DONE REGISTERING', rootStore._modules.root._children.foo._children['1']._children)
    console.log('FINAL NAMESPACE MAP', rootStore._modulesNamespaceMap)
  }
}

export function install (_Vue) {
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
