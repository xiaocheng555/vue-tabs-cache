<template>
  <div>
    <el-tabs
      type="card"
      v-model="curTabName"
      @tab-click="clickTab">
      <el-tab-pane
        label="tab1"
        name="/soon1">
      </el-tab-pane>
      <el-tab-pane
        label="tab2"
        name="/soon2">
      </el-tab-pane>
    </el-tabs>
    <router-view v-slot="{ Component }">
      <keep-alive :include="caches">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useRouteCache from '@/hooks/useRouteCache'
import { TabsPaneContext } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

const { caches } = useRouteCache()
const router = useRouter()
const route = useRoute()
const curTabName = ref(route.path)

defineOptions({
  name: 'Chilld'
})

// 点击tab
function clickTab (pane: TabsPaneContext) {
  if (typeof pane.paneName === 'string') {
    router.push(pane.paneName)
  }
}

watch(() => route.path, (val) => {
  curTabName.value = val
})
</script>

<style lang='less' scoped>
</style>