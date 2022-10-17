<template>
  <!-- firstOpen: 页面渲染时，触发自动打开弹窗，如果线程忙时，弹窗打开动画会卡顿，所以要将动画给去掉 -->
  <a-drawer
    v-bind="$attrs"
    v-on="$listeners"
    :visible="dialogVisible"
    width="50%"
    :title="title"
    @close="dialogVisible = false">
    <slot></slot>
  </a-drawer>
</template>

<script>
import HistoryPopupMixin from '../mixins/historyPopup'

export default {
  name: 'HistoryAntDrawer',
  mixins: [HistoryPopupMixin],
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style lang='less'>

</style>