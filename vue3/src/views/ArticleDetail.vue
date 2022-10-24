<template>
  <div class="article-detail" v-loading="loading">
    <div v-if="!article">
      文章不存在！
    </div>
    <div v-else>
      <el-button type="danger" @click="delArticle">删除文章</el-button>
      <p>{{article.userName}}</p>
      <p>{{article.time}}</p>
      <p>{{article.address}}</p>
      <p>{{article.content}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { IArticle } from './data'
import articleData from '@/mock/article.json'
import useRouteCache from '@/hooks/useRouteCache'
import useKeepScroll from '@/hooks/useKeepScroll'
import EventBus from '@/utils/event-bus'

const props = defineProps({
  id: {
    type: String
  }
})

const loading = ref(false)
const article = ref<IArticle | null | undefined>(null)
const router = useRouter()
const { removeCache } = useRouteCache()
useKeepScroll()

function getArticle () {
  loading.value = true
  setTimeout(() => {
    article.value = articleData.find(item => item.id === Number(props.id))
    if (article.value) {
      EventBus.emit('LayoutTabs:setTabTitle', `文章详情-${article.value.userName}`) // 设置tab标题
    }
    loading.value = false
  }, 1000)
}

async function delArticle () {
  const index = articleData.findIndex(data => data.id === Number(props.id)) 
  articleData.splice(index, 1)
  ElMessage.success('文章已删除')
  
  EventBus.emit('LayoutTabs:closeTab') // 关闭当前tab
  removeCache('ArticleList') // 清除列表页缓存
  // 跳转列表页
  if (window.history.state?.back === '/article') {
    await router.go(-1)
  } else {
    await router.replace('/article') 
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