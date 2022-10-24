<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions('cache', [
      'addCache',
      'removeCache'
    ]),
    // 收集缓存（通过监听）
    collectCaches () {
      // 收集当前路由相关的缓存
      this.$route.matched.forEach(routeMatch => {
        const instance = routeMatch.components?.default
        const componentName = instance?.name
        
        if (process.env.NODE_ENV === 'development') {
          this.checkRouteComponentName(componentName, instance?.__file)
        }
        
        // 配置了meta.keepAlive的路由组件添加到缓存
        if (routeMatch.meta.keepAlive) {
          if (!componentName) {
            console.warn(`${routeMatch.path} 路由的组件名称name为空`)
            return
          }
          this.addCache(componentName)
        } else {
          this.removeCache(componentName)
        }
      })
    },
    // 检测路由组件名称是否重复（组件重名会缓存到不该缓存的组件，而且不容易排查问题，所以开发环境时检测重名）
    checkRouteComponentName (name, file) {
      if (!this.cmpNames) this.cmpNames = {}
      if (this.cmpNames[name]) {
        if (this.cmpNames[name] !== file) {
          console.warn(`${file} 与${this.cmpNames[name]} 组件名称重复： ${name}`)
        }
      } else {
        this.cmpNames[name] = file
      }
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler () {
        this.collectCaches()
      }
    }
  }
}
</script>

<style lang='less'>
* {
  margin: 0;
  padding: 0;
}
html, body {
  overflow-y: hidden;
}
@media (max-width: 768px) {
  #app {
    width: 300%;
  }
}
</style>