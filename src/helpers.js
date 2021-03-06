// TODO: Probably need to use the `beforeCreate` hook io order to ensure that computed properties
//       are re-created in components whenever the selected entity changes.
// TODO: Force components to use a :key property that is linked to the selected entitie(s)
// @see: https://michaelnthiessen.com/force-re-render/ (find "Key-changing")
// @see: https://github.com/vuejs/vuex/blob/dev/src/helpers.js

import {
  mapState as mapStateCore,
  mapActions as mapActionsCore,
  mapMutations as mapMutationsCore,
  mapGetters as mapGettersCore
} from 'vuex'

import get from 'dlv'

export function mapState (path, bindings) {
  const namespace = resolveNamespace(path, this.$store)

  return mapStateCore(namespace, bindings)
}

export function mapActions (path, bindings) {
  const namespace = resolveNamespace(path, this.$store)

  return mapActionsCore(namespace, bindings)
}

export function mapMutations (path, bindings) {
  const namespace = resolveNamespace(path, this.$store)

  return mapMutationsCore(namespace, bindings)
}

export function mapGetters (path, bindings) {
  const namespace = resolveNamespace(path, this.$store)

  return mapGettersCore(namespace, bindings)
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
