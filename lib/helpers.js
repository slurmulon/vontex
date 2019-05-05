// @see: https://github.com/vuejs/vuex/blob/dev/src/helpers.js

import get from 'dlv'

import {
  mapState as mapStateCore,
  mapActions as mapActionsCore
} from 'vuex'

export function mapState (path, bindings) {
  const namespace = resolveNamespace(path, this.$store)

  console.log('!!! mapState', namespace, bindings)

  return mapStateCore(namespace, bindings)
}

export function mapActions (path, bindings) {
  const namespace = resolveNamespace(path, this.$store)

  return mapActionsCore(namespace, bindings)
}

// Converts wildcard paths into absolute/native store namespaces.
// Replaces `*` with the previous entity's current selection (by id).
// e.g. `products/*/cart` -> `products/0b40e80f-ee07-4917-8a77-c4edcc19a9a0/cart`
// TODO: Consider making this `async` so that we can ensure the `current` getter is synchronized
export function resolveNamespace (path, store) {
  let resolved = path
  const fragments = path.split('/')

  for (let i = 0; i < fragments.length; i++) {
    const fragment = fragments[i]

    // TODO: Throw an error if `*` is the tail character (can only be within `/*/`)
    if (fragment === '*') {
      const entity = fragments[i - 1]
      const parentFragment = fragments.slice(0, i)

      const stateNamespace = parentFragment.join('.')
      // const gettersNamespace = parentFragment.join('/')

      const { selected } = get(store.state, stateNamespace)
      // const { current } = get(store.getters, gettersNamespace)
      // const active = selected || current() // TODO: Establish a way to provide getter args
      const active = selected

      // TODO: Might want to check for `instanceof Entity` instead
      if (typeof active === 'object') {
        resolved = resolved.replace('*', active.id)
      } else if (typeof active === 'number' || typeof active === 'string') {
        resolved = resolved.replace('*', active)
      } else {
        // TODO: Consider supporting a `strict` mode
        throw Error(`Failed to resolve namespace, no selected or current ${entity}`)
      }
    }
  }

  return resolved
}
