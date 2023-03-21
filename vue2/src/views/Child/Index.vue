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

<script>
import RouterViewCache from '@/components/router-view-cache'

export default {
  name: 'Child',
  components: {
    RouterViewCache
  },
  data () {
    return {
      curTabName: this.$route.path
    }
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
