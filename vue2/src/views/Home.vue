<template>
  <div v-loading="loading">
    <div v-if="!loading">
      <h2>首页</h2>
      <br>
      <br>
      <h3>{{time}}, 你好呀!</h3>
      
    </div>
    <p v-for="i in 100" :key="i">{{ i }}</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      loading: true,
      time: new Date().toLocaleString()
    }
  },
  created () {
    setTimeout(() => {
      this.loading = false
    }, 1000)
  }
}
</script>

<style lang='less' scoped>
</style>