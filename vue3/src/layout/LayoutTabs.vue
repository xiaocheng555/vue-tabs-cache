<template>
  <div class="layout-tabs">
    <el-tabs
      type="border-card"
      v-model="curTabKey"
      closable
      @tab-click="clickTab"
      @tab-remove="removeTab">
      <el-tab-pane
        v-for="item in tabs"
        :label="item.title"
        :name="item.tabKey"
        :key="item.tabKey">
        <template #label>
          {{item.title}} <el-icon v-if="item.tabKey === curTabKey" @click="refreshTab"><Refresh /></el-icon>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div class="close-tabs" @click="closeOtherTabs">关闭其他</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter, LocationQuery, RouteParams, RouteLocationNormalizedLoaded } from 'vue-router'
import { TabsPaneContext } from 'element-plus'
import useRouteCache from '@/hooks/useRouteCache'
import useLayoutStore from '@/store/layout'
import EventBus from '@/utils/event-bus'

const props = defineProps({
  // 【根据项目修改】tab页面在路由的第几层，或者说第几层的 router-view 组件（当前项目为第二层）
  tabRouteViewDepth: {
    type: Number,
    default: 2 
  },
  // tab页面的key值，从route对象中取，一个key值对应一个tab页面
  // 默认为route.name值（不要设为route.path，因为route.path为'/detail/:id'时会造成一个路由对应多个tab页），可以自己设置 route.meta.tabKey
  getTabKey: {
    type: Function,
    default: (route: RouteLocationNormalizedLoaded) => {
      return route.name
    }
  },
  // tab页签的标题，默认从路由meta.title中获取
  tabTitleKey: {
    type: String,
    default: 'title'
  }
})

interface Tab {
  tabKey?: string,
  title?: string,
  path?: string,
  hash?: string,
  query?: LocationQuery,
  params?: RouteParams,
  componentName?: string,
}

const route = useRoute()
const router = useRouter()
const tabs = ref<Tab []>([])
const curTabKey = ref('')
const { removeCacheEntry, removeCache } = useRouteCache()
const layoutStore = useLayoutStore()

// 切换tab页签
function changeCurTab () {
  // 当前路由信息
  const { path, query, params, hash, matched } = route
  // tab标签页路由信息：meta、componentName
  const routeMatch = matched[props.tabRouteViewDepth - 1]
  const meta = routeMatch.meta
  const componentDef: any = routeMatch.components?.default
  const componentName = componentDef?.name || componentDef?.__name
  // 获取tab标签页信息：tabKey标签页key值；title-标签页标题；tab-存在的标签页
  const tabKey = props.getTabKey(routeMatch)
  const title = String(meta[props.tabTitleKey] || '')
  const tab = tabs.value.find(tab => tab.tabKey === tabKey)
  
  if (path === '/_empty') return // '/_empty'为tab刷新用来中转页面，不需要加tab页签
  if (!tabKey) { // tabKey默认为路由的name值
    console.warn(`LayoutTabs组件：${path} 路由没有匹配的tab标签页，如有需要请配置tab标签页的key值`)
    return 
  }
  
  // 同一个路由，但是新旧路径不同时，需要清除路由缓存。例如route.path配置为 '/detail/:id'时路径会不同
  if (tab && tab.path !== path) {
    removeCacheEntry(componentName || '')
    tab.title = ''
  }
  
  const newTab = {
    tabKey,
    title: tab?.title || title,
    path,
    params,
    query,
    hash,
    componentName 
  }
  tab ? Object.assign(tab, newTab) : tabs.value.push(newTab)
  curTabKey.value = tabKey
}

// 点击tab
function clickTab (pane: TabsPaneContext) {
  if (!pane.index) return
  
  const tab = tabs.value[Number(pane.index)]
  if (tab.tabKey !== curTabKey.value) {
    gotoTab(tab)
  }
}

// 移除tab
async function removeTab (name: string) {
  // 剩下一个时不能删
  if (tabs.value.length === 1) return
  
  const index = tabs.value.findIndex(tab => tab.tabKey === name)
  if (index < -1) return 
  
  const tab = tabs.value[index]
  tabs.value.splice(index, 1)
  
  // 当移除的是当前tab，则自动切换到最后一个tab（根据项目设置）
  if (tab.tabKey === curTabKey.value) {
    const lastTab = tabs.value[tabs.value.length - 1]
    lastTab && gotoTab(lastTab)
  }
  // 同时移除tab缓存
  removeCache(tab.componentName || '')
}

// 跳转tab页面
async function gotoTab (tab: Tab) {
  await router.push({
    path: tab.path,
    query: tab.query,
    hash: tab.hash
  })
}

// 刷新tab页面
async function refreshTab () {
  const tab = tabs.value.find(tab => tab.tabKey === curTabKey.value)
  if (tab) {
    // 先跳转到空白页面，然后清除tab页缓存，接着返回到tab页【最后useRouteCache的collectCaches 方法会重新收集缓存】
    await router.push('/_empty')
    removeCache(tab.componentName || '')
    router.go(-1)
    
    // TODO: 通过layoutStore.isRenderTab 来刷新tab页面会报错，该方案不行（Vue3的bug，详见https://github.com/vuejs/core/issues/5590）
    // layoutStore.setIsRenderTab(false)
    // await removeCacheEntry(tab.componentName || '')
    // layoutStore.setIsRenderTab(true)
  }
}

// 关闭非当前页的所有tab页签
function closeOtherTabs () {
  tabs.value
    .filter(tab => tab.tabKey !== curTabKey.value)
    .forEach(tab => {
      removeCache(tab.componentName || '')
    })
  tabs.value = tabs.value.filter(tab => tab.tabKey === curTabKey.value)
}

// 默认关闭当前tab
async function closeLayoutTab (tabKey: string = curTabKey.value) {
  const index = tabs.value.findIndex(tab => tab.tabKey === tabKey)
  if (index > -1) tabs.value.splice(index, 1)
}

function setCurTabTitle (title: string) {
  const curTab = tabs.value.find(tab => tab.tabKey === curTabKey.value)
  if (curTab) {
    curTab.title = title
  }
}

// 对外提供的事件：关闭弹窗；设置tab标题
EventBus.on('LayoutTabs:closeTab', (tabKey) => {
  closeLayoutTab(tabKey)
})
EventBus.on('LayoutTabs:setTabTitle', (title) => {
  setCurTabTitle(title)
})

watch(() => route.path, changeCurTab, {
  immediate: true
})
</script>

<style lang='less' scoped>
:deep(.el-tabs__content) {
  display: none;
}
.layout-tabs {
  position: relative;
}
.close-tabs {
  position: absolute;
  top: 0;
  right: 0;
  padding: 12px;
  cursor: pointer;
  color: #999;
}
</style>