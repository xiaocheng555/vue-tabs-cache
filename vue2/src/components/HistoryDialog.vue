<template>
  <!-- firstOpen: 页面渲染时，触发自动打开弹窗，如果线程忙时，弹窗打开动画会卡顿，所以要将动画给去掉 -->
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :visible.sync="dialogVisible">
    <slot slot="title" name="title">{{title}}</slot>
    <slot></slot>
  </el-dialog>
</template>

<script>
import HistoryPopupMixin from '../mixins/historyPopup'

export default {
  name: 'HistoryDialog',
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