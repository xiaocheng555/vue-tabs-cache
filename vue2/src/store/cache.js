import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    caches: []
  },
  actions: {
    // 添加缓存的路由组件
    addCache ({ state, dispatch }, componentName) {
      if (Array.isArray(componentName)) {
        componentName.forEach((item) => {
          dispatch('addCache', item)
        })
        return
      }
      
      const { caches } = state
      if (!componentName || caches.includes(componentName)) return

      caches.push(componentName)
      console.log('缓存路由组件：', componentName)
    },

    // 移除缓存的路由组件
    removeCache ({ state, dispatch }, componentName) {
      if (Array.isArray(componentName)) {
        componentName.forEach((item) => {
          dispatch('removeCache', item)
        })
        return
      }
      
      const { caches } = state
      const index = caches.indexOf(componentName)
      if (index > -1) {
        console.log('清除缓存的路由组件：', componentName)
        return caches.splice(index, 1)[0]
      }
    },
    // 移除缓存的路由组件的实例
    async removeCacheEntry ({ dispatch }, componentName) {
      const cacheRemoved = await dispatch('removeCache', componentName)
      if (cacheRemoved) {
        await Vue.nextTick()
        dispatch('addCache', componentName)
      }
    },
    // 清除缓存的路由组件的实例
    clearEntry ({ state, dispatch }) {
      const { caches } = state
      caches.slice().forEach(key => {
        dispatch('removeCacheEntry', key)
      })
    }
  }
}