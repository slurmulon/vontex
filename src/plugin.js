// @see: https://vuex.vuejs.org/guide/modules.html#caveat-for-plugin-developers

import Vuex from 'vuex'
import mixin from './mixin'

export default {
  install (Vue, options) {
    Vue.use(Vuex)

    mixin(Vue)
  }
}
