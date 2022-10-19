<template>
  <el-container class="layout-container-demo" style="height: 100vh;">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu router>
          <el-menu-item 
            v-for="(menu, index) in menus" 
            :index="String(index)"
            :route="{ path: menu.link }"
            :key="index">
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
          <keep-alive :include="caches">
            <router-view v-if="isRenderTab"></router-view>
          </keep-alive>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LayoutTabs from './LayoutTabs.vue'
import { mapState } from 'vuex'

export default {
  components: {
    LayoutTabs,
  },
  data () {
    return {
      menus: [
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
      ]
    }
  },
  computed: {
    ...mapState('cache', ['caches']),
    ...mapState(['isRenderTab'])
  }
}
</script>

<style lang="less" scoped>
:deep(.el-menu-item.is-active) {
  &:focus {
    color: #303133;
    background: transparent !important;
  }
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
