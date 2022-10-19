<template>
  <div class="article-detail" v-loading="loading">
    <el-button type="danger" @click="delArticle">删除文章</el-button>
    <p>{{article.userName}}</p>
    <p>{{article.time}}</p>
    <p>{{article.address}}</p>
    <p>{{article.content}}</p>
  </div>
</template>

<script>
import articleData from '@/mock/article.json'
import EventBus from '@/utils/event-bus'
import { mapActions } from 'vuex'

export default {
  name: 'Article',
  keepScroll: true,
  props: {
    id: {
      type: String
    }
  },
  data () {
    return {
      article: {},
      loading: false
    }
  },
  methods: {
    ...mapActions('cache', [
      'removeCache'
    ]),
    getArticle () {
      this.loading = true
      setTimeout(() => {
        this.article = articleData.find(item => item.id === Number(this.id))
        this.loading = false
      }, 1000)
    },
    async delArticle () {
      const index = articleData.findIndex(data => data.id === Number(this.id)) 
      articleData.splice(index, 1)
      this.$message.success('文章已删除')
      
      EventBus.$emit('LayoutTabs:closeTab') // 关闭当前tab页
      this.removeCache('ArticleList') // 清除列表页缓存
      this.removeCache('Article') // 清除详情页页缓存
      this.$router.replace('/article') // 跳转列表页
    }
  },
  created () {
    this.getArticle()
  }
}
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
