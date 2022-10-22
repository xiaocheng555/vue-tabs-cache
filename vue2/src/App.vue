<template>
  <div>
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
        const componentName = routeMatch.components?.default?.name
        
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
</style>