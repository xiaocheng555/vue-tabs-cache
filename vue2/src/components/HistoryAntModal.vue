<template>
  <!-- firstOpen: 页面渲染时，触发自动打开弹窗，如果线程忙时，弹窗打开动画会卡顿，所以要将动画给去掉 -->
  <a-modal
    v-bind="$attrs"
    v-on="$listeners"
    v-model="dialogVisible">
    <slot slot="title" name="title">{{title}}</slot>
    <slot></slot>
  </a-modal>
</template>

<script>
import HistoryPopupMixin from '../mixins/historyPopup'

export default {
  name: 'HistoryAntModal',
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