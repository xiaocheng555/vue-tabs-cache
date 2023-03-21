<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="caches" :max="max">
      <component
        :is="Component"
        :router-view-cache-scroller="route.meta.scroller ?? scroller"
        :router-view-cache-reset-scroll="route.meta.resetScroll ?? resetScroll" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getCurrentInstance } from 'vue'
import useRouteCache from './useRouteCache'
import registerKeepScroll from './keepScroll'

defineProps({
  // 滚动容器css选择器
  scroller: {
    type: [String, Array]
  },
  // 最大缓存数
  max: {
    type: Number
  },
  // 重置滚动位置（0，0）
  resetScroll: {
    type: Boolean,
    default: false
  }
})

const instance = getCurrentInstance()
const route = useRoute()
const { caches, collectCaches } = useRouteCache()

instance && registerKeepScroll(instance.appContext.app) // 注册记录滚动位置逻辑
collectCaches() // 收集缓存
</script>
