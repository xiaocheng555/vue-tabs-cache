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
    <keep-alive :include="caches">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Child',
  keepScroll: true,
  data () {
    return {
      curTabName: this.$route.path
    }
  },
  computed: {
    ...mapState('cache', ['caches']),
  },
  methods: {
    clickTab (pane) {
      if (typeof pane.paneName === 'string' && this.$route.path !== pane.paneName) {
        this.$router.push(pane.paneName)
      }
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler (val) {
        this.curTabName = val
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>
