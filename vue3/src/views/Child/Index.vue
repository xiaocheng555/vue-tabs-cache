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
    <router-view-cache></router-view-cache>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { TabsPaneContext } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import RouterViewCache from '@/components/router-view-cache'

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