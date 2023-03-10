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
        <template slot="label">{{item.title}} <i v-if="curTabKey === item.tabKey" class="el-icon-refresh" @click="refreshTab(item)"></i></template>
      </el-tab-pane>
    </el-tabs>
    <div class="close-tabs" @click="closeOtherTabs">关闭其他</div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import EventBus from '@/utils/event-bus'

export default {
  name: 'LayoutTabs',
  props: {
    // 【根据项目修改】tab页面在路由的第几层，或者说第几层的 router-view 组件（当前项目为第二层）
    tabRouteViewDepth: {
      type: Number,
      default: 2 
    },
    // tab页面的key值，从route对象中取，一个key值对应一个tab页面
    // 默认为matchRoute.path值
    getTabKey: {
      type: Function,
      default: function (routeMatch/* , route */) {
        return routeMatch.path
      }
    },
    // tab页签的标题，默认从路由meta.title中获取
    tabTitleKey: {
      type: String,
      default: 'title'
    }
  },
  data () {
    return {
      tabs: [],
      curTabKey: ''
    }
  },
  methods: {
    ...mapActions('cache', [
      'addCache', 
      'removeCache',
      'removeCacheEntry'
    ]),
    ...mapMutations([
      'setIsRenderTab'
    ]),
    // 切换tab
    changeCurTab () {
      // 当前路由信息
      const { path, query, params, hash, matched } = this.$route
      // tab标签页路由信息：meta、componentName
      const routeMatch = matched[this.tabRouteViewDepth - 1]
      const meta = routeMatch.meta
      const componentName = routeMatch.components?.default?.name
      // 获取tab标签页信息：tabKey标签页key值；title-标签页标题；tab-存在的标签页
      const tabKey = this.getTabKey(routeMatch, this.$route)
      const title = String(meta[this.tabTitleKey] || '')
      const tab = this.tabs.find(tab => tab.tabKey === tabKey)
      
      if (!tabKey) { // tabKey默认为路由的name值
        console.warn(`LayoutTabs组件：${path} 路由没有匹配的tab标签页，如有需要请配置tab标签页的key值`)
        return 
      }
      
      // 同一个路由，但是新旧路径不同时，需要清除路由缓存。例如route.path配置为 '/detail/:id'时路径会不同
      // 这里判断 props.tabRouteViewDepth === matched.length 必须是跟tab同级路由，否则会影响多级路由缓存
      if (tab && tab.path !== path && this.tabRouteViewDepth === matched.length) {
        this.removeCacheEntry(componentName || '')
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
      tab ? Object.assign(tab, newTab) : this.tabs.push(newTab)
      this.curTabKey = tabKey
    },
    // 点击tab
    clickTab (pane) {
      if (!pane.index) return
      
      const tab = this.tabs[Number(pane.index)]
      if (tab.path !== this.$route.path) {
        this.gotoTab(tab)
      }
    },
    // 移除tab
    async removeTab (tabKey) {
      // 剩下一个时不能删
      if (this.tabs.length === 1) return
      
      const index = this.tabs.findIndex(tab => tab.tabKey === tabKey)
      if (index < -1) return 
      
      const tab = this.tabs[index]
      this.tabs.splice(index, 1)
      
      // 如果删除的是当前tab，则切换到最后一个tab
      if (tab.tabKey === this.curTabKey) {
        const lastTab = this.tabs[this.tabs.length - 1]
        lastTab && this.gotoTab(lastTab)
      }
      this.removeCache(tab.componentName || '')
    },
    // 跳转tab页面
    async gotoTab (tab) {
      await this.$router.push({
        path: tab.path,
        query: tab.query,
        hash: tab.hash
      })
    },
    // 关闭非当前页的所有tab页签
    closeOtherTabs () {
      this.tabs
        .filter(tab => tab.tabKey !== this.curTabKey)
        .forEach(tab => {
          this.removeCache(tab.componentName || '')
        })
      this.tabs = this.tabs.filter(tab => tab.tabKey === this.curTabKey)
    },
    // 刷新当前tab页面
    async refreshTab (tab) {
      this.setIsRenderTab(false)
      await this.removeCacheEntry(tab.componentName)
      this.setIsRenderTab(true)
    },
    // 关闭tab页面，默认关闭当前页
    async closeLayoutTab (tabKey = this.curTabKey) {
      const index = this.tabs.findIndex(tab => tab.tabKey === tabKey)
      if (index > -1) {
        this.removeCache(this.tabs[index].componentName)
        this.tabs.splice(index, 1) 
      }
    },
    // 设置当前tab的标题
    setCurTabTitle (title) {
      const curTab = this.tabs.find(tab => tab.tabKey === this.curTabKey)
      if (curTab) {
        curTab.title = title
      }
    }
  },
  watch: {
    '$route.path': {
      handler () {
        this.changeCurTab()
      },
      immediate: true
    }
  },
  created () {
    // 对外提供的事件：关闭弹窗；设置tab标题
    EventBus.$on('LayoutTabs:closeTab', (tabKey) => {
      this.closeLayoutTab(tabKey)
    })
    EventBus.$on('LayoutTabs:setTabTitle', (title) => {
      this.setCurTabTitle(title)
    })
  }
}
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