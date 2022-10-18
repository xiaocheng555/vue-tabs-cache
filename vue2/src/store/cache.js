import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    caches: []
  },
  mutations: {
    // 添加缓存的路由组件
    addCache ({ caches }, componentName) {
      if (!componentName || caches.includes(componentName)) return

      caches.push(componentName)
      console.log('缓存路由组件：', componentName)
    },

    // 移除缓存的路由组件
    removeCache ({ caches }, componentName) {
      const index = caches.indexOf(componentName)
      if (index > -1) {
        console.log('清除缓存的路由组件：', componentName)
        return caches.splice(index, 1)
      }
    },

    // 清除缓存的路由组件的实例
    // clearEntry({ caches }) {
    //   caches.slice().forEach(key => {
    //     removeCacheEntry(key)
    //   })
    // }
  },
  actions: {
    // 移除缓存的路由组件的实例
    removeCacheEntry (context, componentName) {
      return new Promise((resolve) => {
        if (context.commit('removeCache', componentName)) {
          Vue.$nextTick(() => {
            context.commit('addCache', componentName)
            resolve()
          })
        } else {
          resolve()
        }
      })
    }
  }
}