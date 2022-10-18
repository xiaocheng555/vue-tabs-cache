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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import EventBus from '@/utils/event-bus'

const KeepAliveRouteViewDepth = 2 // 【根据项目修改】keep-alive 缓存哪层router-view组件（第二层）

export default {
  name: '',
  components: {},
  data () {
    return {
      tabs: [],
      currTab: ''
    }
  },
  methods: {
    ...mapMutations('cache', [
      'addCache', 
      'removeCache'
    ]),
    ...mapActions('cache', [
      'removeCacheEntry'
    ]),
    // 点击tab
    clickTab (pane) {
      if (!pane.index) return
      
      const tab = this.tabs[Number(pane.index)]
      if (tab.path !== this.$route.path) {
        this.gotoTab(tab)
      }
    },

    // 跳转tab页面
    async gotoTab (tab) {
      await this.$router.push({
        path: tab.path,
        query: tab.query,
        hash: tab.hash
      })
    },

    // 切换tab
    changeCurTab () {
      const { name, path, meta, query, params, hash, matched } = this.$route
      const routeMatch = matched[KeepAliveRouteViewDepth - 1]
      const componentName = routeMatch.components?.default?.name
      const tab = this.tabs.find(tab => tab.routeName === name)
      
      if (!name) {
        console.warn(`LayoutTabs组件：请给 ${path} 路由配置name`)
      }
      
      // 配置了meta.keepAlive的路由组件添加到缓存
      if (meta.keepAlive) {
        this.addCache(componentName)
      } else {
        this.removeCache(componentName)
      }
      
      // 如果同一tab路径变了（使用/detail/:id），则清除缓存实例
      if (tab && tab.path !== path) {
        this.removeCacheEntry(componentName || '')
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
      tab ? Object.assign(tab, newTab) : this.tabs.push(newTab)
      this.currTab = String(name) || ''
    },

    // 移除tab
    async removeTab (name) {
      // 剩下一个时不能删
      if (this.tabs.length === 1) return
      
      const index = this.tabs.findIndex(tab => tab.routeName === name)
      if (index < -1) return 
      
      const tab = this.tabs[index]
      this.tabs.splice(index, 1)
      
      // 切换到最后一个tab
      if (tab.routeName === this.currTab) {
        const lastTab = this.tabs[this.tabs.length - 1]
        await this.gotoTab(lastTab)
      }
      this.removeCacheEntry(tab.componentName || '')
    },

    // 关闭当前tab并跳转
    async closeLayoutTab (options) {
      if (!options.name) options.name = this.currTab
      if (!options.rediect) options.rediect = '/'
      if (!options.isReplace) options.isReplace = true
      
      const action = options.isReplace ? 'replace' : 'push'
      const index = this.tabs.findIndex(tab => tab.routeName === options.name)
      if (index === -1) return 
      
      const tab = this.tabs[index]
      this.tabs.splice(index, 1)
      await this.$router[action](options.rediect)
      this.removeCacheEntry(tab.componentName || '')
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
    EventBus.$on('LayoutTabs:closeTab', (data) => {
      this.closeLayoutTab(data)
    })
  }
}
</script>

<style lang='less' scoped>
:deep(.el-tabs__content) {
  display: none;
}
</style>