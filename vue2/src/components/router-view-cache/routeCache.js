import Vue from 'vue'

let collect = false // 是否进行了收集缓存
const routeComponeotMap = new Map() // 根据路由名找到组件名的映射
const cmpNames = {} // 根据组件名找到组件文件路由

const routeCache = new Vue({
  data: {
    caches: []
  },
  methods: {
    // 收集缓存（通过监听）
    collectCaches (vm) {
      if (collect) return // 只调用一次

      collect = true
      this.$watch(() => vm.$route.path, () => this.collectRouteCaches(vm.$route), {
        immediate: true
      })
    },

    // 收集当前路由相关的缓存
    collectRouteCaches (route) {
      this.$nextTick(() => {
        route.matched.forEach(routeMatch => {
          const instance = routeMatch.components?.default
          const componentName = instance?.name
          const file = instance?.__file
  
          if (process.env.NODE_ENV === 'development') {
            this.checkComponentName(componentName, file)
          }
  
          // 配置了meta.keepAlive的路由组件添加到缓存
          if (routeMatch.meta.keepAlive) {
            if (!componentName) {
              console.warn(`${routeMatch.path} 路由的组件名称name为空，无法添加缓存`)
              return
            }
            if (routeMatch.name) {
              routeComponeotMap.set(routeMatch.name, componentName)
            }
            routeCache.addCache(componentName)
          } else if (routeMatch.meta.keepAlive === false) {
            routeCache.removeCache(componentName)
          }
        })
      })
    },

    // 检测路由组件名称是否重复（组件重名会缓存到不该缓存的组件，而且不容易排查问题，所以开发环境时检测重名）
     checkComponentName (name, file) {
      if (cmpNames[name]) {
        if (cmpNames[name] !== file) {
          console.warn(`${file} 与${cmpNames[name]} 组件名称重复： ${name}，可能导致组件缓存问题`)
        }
      } else {
        cmpNames[name] = file
      }
    },
    
    // 添加缓存的路由组件
    addCache (componentName) {
      if (!componentName || this.caches.includes(componentName)) return
      this.caches.push(componentName)
      console.log('缓存路由组件：', componentName)
    },

    // 移除缓存的路由组件
    removeCache (componentName) {
      const index = this.caches.indexOf(componentName)
      if (index > -1) {
        console.log('清除缓存的路由组件：', componentName)
        return this.caches.splice(index, 1)
      }
    },

    // 移除缓存的路由组件（传入路由名称）
    removeRouteCache (routeName) {
      const componentName = cmpNames[routeName]
      if (componentName) {
        this.removeCache(componentName)
      }
    },

    // 移除缓存的路由组件的实例（极少会用到）
    async removeCacheEntry (componentName) {
      if (this.removeCache(componentName)) {
        this.$nextTick(() => {
          this.addCache(componentName)
        })
      }
    }
  }
})

export default routeCache