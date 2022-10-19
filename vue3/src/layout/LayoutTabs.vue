<template>
  <div>
    <el-tabs
      type="border-card"
      v-model="currTab"
      closable
      @tab-click="clickTab"
      @tab-remove="removeTab">
      <el-tab-pane
        v-for="item in tabs"
        :label="item.title"
        :name="item.routeName"
        :key="item.routeName">
        <template #label>
          {{item.title}} <el-icon v-if="item.routeName === currTab" @click="refreshTab"><Refresh /></el-icon>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter, LocationQuery, RouteParams } from 'vue-router'
import { TabsPaneContext } from 'element-plus'
import useRouteCache from '@/hooks/useRouteCache'
import useLayoutStore from '@/store/layout'

const KeepAliveRouteViewDepth = 2 // 【根据项目修改】keep-alive 缓存哪层router-view组件（第二层）

interface Tab {
  title?: string,
  path?: string,
  routeName?: string,
  hash?: string,
  componentName?: string,
  query?: LocationQuery,
  params?: RouteParams,
}

const route = useRoute()
const router = useRouter()
const tabs = ref<Tab []>([])
const currTab = ref('')
const { removeCacheEntry, addCache, removeCache } = useRouteCache()
const layoutStore = useLayoutStore()

// 点击tab
function clickTab (pane: TabsPaneContext) {
  if (!pane.index) return
  
  const tab = tabs.value[Number(pane.index)]
  
  if (tab.routeName !== currTab.value) {
    gotoTab(tab)
  }
}

// 跳转tab页面
async function gotoTab (tab: Tab) {
  await router.push({
    path: tab.path,
    query: tab.query,
    hash: tab.hash
  })
}

// 切换tab
function changeCurTab () {
  const { name, path, meta, query, params, hash, matched } = route
  const routeMatch = matched[KeepAliveRouteViewDepth - 1]
  const componentDef: any = routeMatch.components?.default
  const componentName = componentDef?.__name
  const tab = tabs.value.find(tab => tab.routeName === name)
  
  if (path === '/_empty') return
  if (!name) {
    console.warn(`LayoutTabs组件：请给 ${path} 路由配置name`)
  }
  
  // 配置了meta.keepAlive的路由组件添加到缓存
  if (meta.keepAlive) {
    addCache(componentName)
  } else {
    removeCache(componentName)
  }
  
  // 如果同一tab路径变了（例如路径为 /detail/:id），则清除缓存实例
  if (tab && tab.path !== path) {
    removeCacheEntry(componentName || '')
  }
  
  const newTab = {
    title: String(meta?.title || ''),
    routeName: name?.toString(),
    path: path,
    params,
    query,
    hash,
    componentName 
  }
  tab ? Object.assign(tab, newTab) : tabs.value.push(newTab)
  currTab.value = String(name) || ''
}

// 移除tab
async function removeTab (name: string) {
  // 剩下一个时不能删
  if (tabs.value.length === 1) return
  
  const index = tabs.value.findIndex(tab => tab.routeName === name)
  if (index < -1) return 
  
  const tab = tabs.value[index]
  tabs.value.splice(index, 1)
  
  // 切换到最后一个tab
  if (tab.routeName === currTab.value) {
    const lastTab = tabs.value[tabs.value.length - 1]
    lastTab && gotoTab(lastTab)
  }
  removeCache(tab.componentName || '')
}

// 关闭当前tab
async function closeLayoutTab (routeName: string = currTab.value) {
  const index = tabs.value.findIndex(tab => tab.routeName === routeName)
  if (index === -1) return 
  
  tabs.value.splice(index, 1)
}
layoutStore.registerCloseTab(closeLayoutTab)

// 刷新tab页面
async function refreshTab () {
  const tab = tabs.value.find(tab => tab.routeName === currTab.value)
  if (tab) {
    await router.push('/_empty')
    removeCacheEntry(tab.componentName || '')
    router.go(-1)
    
    // TODO:通过layoutStore.isRenderTab 来刷新tab页面会报错，该方案不行
    // layoutStore.setIsRenderTab(false)
    // await removeCacheEntry(tab.componentName || '')
    // layoutStore.setIsRenderTab(true)
  }
}

watch(() => route.path, changeCurTab, {
  immediate: true
})
</script>

<style lang='less' scoped>
:deep(.el-tabs__content) {
  display: none;
}
</style>