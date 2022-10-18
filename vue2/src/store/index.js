import Vue from 'vue'
import Vuex from 'vuex'
import cacheModule from './cache'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    'cache': cacheModule
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {}
})