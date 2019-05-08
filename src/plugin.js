// @see: https://vuex.vuejs.org/guide/modules.html#caveat-for-plugin-developers

import Vuex from 'vuex'
import mixin from './mixin'

export default {
  // TODO: Allow custom `primaryKey` property (default to `id`)
  // TODO: Allow custom `wildcard` character (default to `*`)
  install (Vue, options) {
    Vue.use(Vuex)

    mixin(Vue)
  }
}
