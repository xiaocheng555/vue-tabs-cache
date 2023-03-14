<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="caches">
      <component 
        :is="Component" 
        :router-view-cache-scroller="route.meta.scroller || scroller" 
        :keepScroll="route.meta.keepScroll !== false" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useRouteCache from './useRouteCache'
import { useRoute } from 'vue-router'

defineProps({
  scroller: {
    type: String
  }
})

const route = useRoute()
const { caches, collectCaches } = useRouteCache()

// 收集缓存
onMounted(() => collectCaches())
</script>

<style lang='less' scoped>
</style>