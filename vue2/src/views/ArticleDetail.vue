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

<script>
import articleData from '@/mock/article.json'
import EventBus from '@/utils/event-bus'
import { mapActions } from 'vuex'

export default {
  name: 'ArticleDetail',
  keepScroll: false,
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
      if (!this.articleCaches) {
        this.articleCaches = {}
      }
      
      // 从缓存获取数据
      const articleCache = this.articleCaches[this.id]
      if (articleCache) {
        this.article = articleCache.data
        this.$nextTick(() => {
          document.querySelector('#app-main-scroller').scrollTop = articleCache.scrollTop
        })
        return 
      }
      
      // 从接口获取数据
      this.loading = true
      this.article = {}
      setTimeout(() => {
        this.article = articleData.find(item => item.id === Number(this.id))
        // 缓存数据
        this.articleCaches[this.id] = {
          data: this.article
        }
        if (this.article) {
          EventBus.$emit('LayoutTabs:setTabTitle', `文章详情-${this.article.userName}`) // 设置tab标题
        }
        this.loading = false
      }, 1000)
    },
    async delArticle () {
      const index = articleData.findIndex(data => data.id === Number(this.id)) 
      articleData.splice(index, 1)
      this.$message.success('文章已删除')
      
      EventBus.$emit('LayoutTabs:closeTab') // 关闭当前tab页
      this.removeCache('ArticleList') // 清除列表页缓存
      this.$router.replace('/article') // 跳转列表页
    },
    recordScroll () {
      if (this.articleCaches && this.articleCaches[this.id]) {
        const articleCache = this.articleCaches[this.id]
        articleCache.scrollTop = document.querySelector('#app-main-scroller')?.scrollTop || 0
        console.log(articleCache.scrollTop, 'articleCache.scrollTop')
      }
    }
  },
  watch: {
    id () {
      this.getArticle()
    }
  },
  activated () {
    this.getArticle()
    document.querySelector('#app-main-scroller').addEventListener('scroll', this.recordScroll)
  },
  deactivated () {
    document.querySelector('#app-main-scroller').removeEventListener('scroll', this.recordScroll)
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
