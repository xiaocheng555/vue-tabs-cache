<template>
  <keep-alive :include="caches">
    <router-view 
      v-if="isRender"
      :router-view-cache-scroller="getScroller">
    </router-view>
  </keep-alive>
</template>

<script>
import routeCache from './routeCache'
import registerKeepScroll from './keepScroll'

registerKeepScroll()

export default {
  name: 'router-view-cache',
  props: {
    // 滚动容器css选择器
    scroller: {
      type: [String, Array]
    },
    // 最大缓存数
    max: {
      type: Number
    },
    isRender: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      caches: routeCache.caches
    }
  },
  computed: {
    getScroller () {
      const curScroller = this.$route.meta.scroller
      return typeof curScroller !== 'undefined' ? curScroller : this.scroller
    }
  },
  created () {
    routeCache.collectCaches(this)
  }
}
</script>

<style lang='less' scoped>
</style>