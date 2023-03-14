<template>
  <div>
    <h1>keep-alive 记录滚动位置</h1>
    <p v-for="i in 100" :key="i">{{i}}我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容</p>
  </div>
</template>

<script setup lang="ts">
import useKeepScroll from '@/hooks/useKeepScroll'

defineOptions({
  name: 'ArticleDetail'
})

// useKeepScroll()
</script>
