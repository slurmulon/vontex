import {
  mapState,
  mapActions,
  mapMutations,
  mapGetters
} from './helpers'

export default function (Vue) {
  Vue.mixin({ beforeCreate: init })

  function init () {
    const { context } = this.$options

    if (context) {
      if (context instanceof Function) {
        // TODO: Try to avoid the need for this by deferring invocation of helper methods
        // @see: https://github.com/vuejs/vuex/blob/dev/src/helpers.js#L10
        // @see: https://github.com/vuejs/vuex/blob/dev/src/helpers.js#L117
        const options = context.bind(this)({
          vm: this,
          mapState: mapState.bind(this),
          mapActions: mapActions.bind(this),
          mapMutations: mapMutations.bind(this),
          mapGetters: mapGetters.bind(this)
        })

        // FIXME: Merge with each individual $option instead shallow override
        Object.assign(this.$options, options)
      } else {
        throw Error('context must be a function')
      }
    }
  }
}
