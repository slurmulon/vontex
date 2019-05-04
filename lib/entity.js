export function register (key, entity) {

}

export function unregister (key) {

}

export class Entity {
  constructor ({
    id,
    state,
    mutations,
    actions,
    getters
  }) {
    this.id = id
    this.state = state
    this.mutations = mutations
    this.actions = actions
    this.getters = getters
  }
}
