<template>
  <div class="article-detail" v-loading="loading">
    <el-button type="danger" @click="delArticle">删除文章</el-button>
    <p>{{article?.userName}}</p>
    <p>{{article?.time}}</p>
    <p>{{article?.address}}</p>
    <p>{{article?.content}}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { IArticle } from './data.d'
import articleData from '@/mock/article.json'
import useRouteCache from '@/hooks/useRouteCache'
import useLayoutStore from '@/store/layout'
import useKeepScroll from '@/hooks/useKeepScroll'

const props = defineProps({
  id: {
    type: String
  }
})

const loading = ref(false)
const article = ref<IArticle | null | undefined>(null)
const router = useRouter()
const route = useRoute()
const { removeCache } = useRouteCache()
const layoutStore = useLayoutStore()
useKeepScroll()

function getArticle () {
  console.log(route, 'route')
  loading.value = true
  setTimeout(() => {
    article.value = articleData.find(item => item.id === Number(props.id))
    loading.value = false
  }, 1000)
}

async function delArticle () {
  const index = articleData.findIndex(data => data.id === Number(props.id)) 
  articleData.splice(index, 1)
  ElMessage.success('文章已删除')
  
  layoutStore.closeTab() // 关闭当前tab
  removeCache('ArticleList') // 清除列表页缓存
  removeCache('Article') // 清除详情页页缓存
  // 跳转列表页
  if (window.history.state?.back !== '/article') {
    await router.replace('/article') 
  } else {
    await router.go(-1)
  }
}

onMounted(() => {
  getArticle()
})
</script>

<style lang='less' scoped>
.article-detail p {
  width: 600px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 2.5;
  text-align: center;
}
</style>