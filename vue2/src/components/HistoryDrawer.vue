<template>
  <!-- firstOpen: 页面渲染时，触发自动打开弹窗，如果线程忙时，弹窗打开动画会卡顿，所以要将动画给去掉 -->
  <el-drawer
    v-bind="$attrs"
    v-on="$listeners"
    :title="title"
    :visible.sync="dialogVisible"
    :custom-class="`history-dialog ${firstOpen && 'history-dialog_no-anim'}`">
    <slot></slot>
  </el-drawer>
</template>

<script>
import HistoryPopupMixin from '../mixins/historyPopup'

export default {
  name: 'HistoryDrawer',
  mixins: [HistoryPopupMixin],
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style lang='less'>
.history-dialog {
  &.history-dialog_no-anim {
    animation: none !important;
  }
}
</style>