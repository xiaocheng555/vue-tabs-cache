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
          {{item.title}}
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter, LocationQuery, RouteParams, RouteLocationRaw } from 'vue-router'
import { TabsPaneContext } from 'element-plus'
import useRouteCache from '@/hooks/useRouteCache'
import useLayoutTab from '@/store/layoutTab'

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
const layoutTab = useLayoutTab()

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
  
  if (meta.keepAlive) {
    addCache(componentName)
  } else {
    removeCache(componentName)
  }
  
  // 如果同一tab路径变了（使用/detail/:id），则清除缓存实例
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
    await gotoTab(lastTab)
  }
  removeCacheEntry(tab.componentName || '')
}

// 关闭当前tab
async function closeLayoutTab (options: {
  name?: string,
  rediect?: RouteLocationRaw,
  isReplace?: boolean
}) {
  if (!options.name) options.name = currTab.value
  if (!options.rediect) options.rediect = '/'
  if (!options.isReplace) options.isReplace = true
  
  const action = options.isReplace ? 'replace' : 'push'
  const index = tabs.value.findIndex(tab => tab.routeName === options.name)
  if (index === -1) return 
  
  const tab = tabs.value[index]
  tabs.value.splice(index, 1)
  await router[action](options.rediect)
  removeCacheEntry(tab.componentName || '')
}
layoutTab.registerCloseTab(closeLayoutTab)

watch(() => route.path, changeCurTab, {
  immediate: true
})
</script>

<style lang='less' scoped>
/deep/ .el-tabs__content {
  display: none;
}
</style>