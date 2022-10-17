<template>
  <div v-loading="loading">
    <div v-if="!loading">
      <h2>首页</h2>
      <br>
      <br>
      <h3>{{time}}, 你好呀!</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const time = ref(new Date().toLocaleString())
const loading = ref(true)

setTimeout(() => {
  loading.value = false
}, 1000)
</script>

<style lang='less' scoped>
</style>