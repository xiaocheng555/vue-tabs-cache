<template>
  <div>
    <h1>过渡页面</h1>
    <el-button type="primary" @click="$router.back()">返回</el-button>
    
    <el-button type="primary" @click="$router.replace({ query: { test: 1 } })">replace</el-button>
    <el-button type="primary" @click="$router.go(-1)">forward</el-button>
  </div>
</template>

<script>

</script>

<style lang='less' scoped>
</style>