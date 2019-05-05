import Vuex from 'vuex'
import mixin from './mixin'

export default {
  install (Vue, options) {
    Vue.use(Vuex)

    mixin(Vue)
  }
}
