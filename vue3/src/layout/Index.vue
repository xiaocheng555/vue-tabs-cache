<template>
  <el-container class="layout-container-demo" style="height: 100vh;">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu router>
          <el-menu-item
            v-for="(menu, index) in menus"
            :index="String(index)"
            :route="{ path: menu.link }">
            {{menu.title}}
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <layout-tabs></layout-tabs>
      </el-header>

      <p style="color: #999; padding: 0 20px 5px;">缓存组件：{{caches}}</p>
      <el-main id="app-main-scroller">
        <div style="padding: 20px;">
          <router-view-cache scroller="#app-main-scroller"></router-view-cache>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import LayoutTabs from './LayoutTabs.vue'
// import useRouteCache from '@/hooks/useRouteCache'
import useLayoutStore from '@/store/layout'
import RouterViewCache, { useRouteCache } from '@/components/router-view-cache'

const { caches } = useRouteCache()
const layoutStore = useLayoutStore()
const menus = ref([
  {
    link: '/',
    title: '首页'
  },
  {
    link: '/article',
    title: '文章列表'
  },
  {
    link: '/child',
    title: '多级缓存'
  },
  {
    link: '/KeepScroll',
    title: '记录滚动位置'
  }
])
</script>

<style scoped>
:deep(.el-menu-item.is-active) {
  color: #303133;
}
.layout-container-demo .el-header {
  position: relative;
}
.layout-container-demo .el-aside {
  border-right: 1px solid #eee;
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
