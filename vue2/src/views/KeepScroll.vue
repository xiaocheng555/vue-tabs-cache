<template>
  <div>
    <h1>keep-alive 记录滚动位置</h1>
    <p v-for="i in 100" :key="i">{{i}}我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容</p>
  </div>
</template>

<script>
export default {
  name: 'KeepScroll',
  keepScroll: true,
  data () {
    return {
    }
  },
  created () {}
}
</script>

<style lang='less' scoped>
</style>