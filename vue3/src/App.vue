<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import useRouteCache from '@/hooks/useRouteCache'

// 收集路由配置meta为keepAlive: ture的缓存
const { collectCaches } = useRouteCache()
collectCaches()
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html, body {
  overflow-y: hidden;
}
@media (max-width: 768px) {
  #app {
    width: 200%;
  }
}
</style>