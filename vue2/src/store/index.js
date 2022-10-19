import Vue from 'vue'
import Vuex from 'vuex'
import cacheModule from './cache'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    'cache': cacheModule
  },
  state: {
    isRenderTab: true
  },
  mutations: {
    setIsRenderTab (state, data) {
      state.isRenderTab = data
    }
  }
})