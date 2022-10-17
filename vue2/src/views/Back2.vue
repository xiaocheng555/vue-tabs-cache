<template>
  <div>
    <h2>检测是否有上一页: {{ hasBack ? '有' : '没有'}}</h2>
    <el-button type="primary" @click="back">返回上一页</el-button>
  </div>
</template>

<script>
export default {
  name: 'back2',
  data () {
    return {
      hasBack: history.state.hasBack
    }
  },
  methods: {
    back () {
      if (!history.state.hasBack) {
        alert('没有上一页')
      } else {
        this.$router.go(-1)
      }
    } 
  }
}
</script>

<style lang='less' scoped>
</style>