// @see: https://github.com/vuejs/vuex/blob/dev/src/helpers.js
import { mapState as mapStateCore } from 'vuex'

export function mapState (path, bindings) {
  // TODO: Parse out * and map it to the `selected` or `current` entity instance of the entity store
  // TODO: Determine if `selected` or `current` is more appropriate
  // const fragments = path.split('/')
  // const { state, getters } = this.$store

  const namespace = resolveNamespace(path, this.$store)

  return mapStateCore(namespace, bindings)
}

// Converts wildcard paths into absolute/native store namespaces.
// Replaces `*` with the previous entity's current selection (by id).
// e.g. `products/*/cart` -> `products/0b40e80f-ee07-4917-8a77-c4edcc19a9a0/cart`
export function resolveNamespace (path, store) {
  let resolved = path
  const fragments = path.split('/')

  for (let i = 0; i < fragments.length; i++) {
    const fragment = fragments[i]

    if (fragment === '*') {
      const entity = fragments[i - 1]
      const parent = fragments.slice(0, i).join('/')

      const { selected } = store.state[parent]
      const { current } = store.getters[parent]
      const active = selected || current

      // TODO: Might want to check for `instanceof Entity` instead
      if (typeof active === 'object') {
        resolved = resolved.replace('*', active.id)
      } else {
        // TODO: Consider supporting a `strict` mode
        throw Error(`Failed to resolve namespace, no selected or current ${entity}`)
      }
    }
  }

  return resolved
}
