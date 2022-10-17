<template>
  <div>
    <el-button type="primary" @click="gotoPage(true)">goto测试1</el-button>
    <el-button type="primary" @click="gotoPage(false)">goto测试2</el-button>
  </div>
</template>

<script>
export default {
  name: 'back',
  methods: {
    gotoPage (_blank = false) {
      if (_blank) {
        window.open('/#/Back2')
      } else {
        this.$router.push({
          path: '/Back2'
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>