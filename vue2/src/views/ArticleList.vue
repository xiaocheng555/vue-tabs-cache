<template>
  <div>
    <el-table :key="refreshKey" v-loading="loading" :data="tableData" border>
      <el-table-column min-width="60" prop="id" label="id" />
      <el-table-column min-width="120" prop="userName" label="用户名" />
      <el-table-column min-width="160" prop="address" label="地址" />
      <el-table-column min-width="200" prop="content" label="内容">
        <template v-slot="{ row }">
          {{row.content.slice(0, 30)}}...
        </template>
      </el-table-column>
      <el-table-column min-width="160" prop="time" label="时间" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-link type="primary" @click="gotoDetail(row)">进入详情</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :currentPage.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="list.length"
    />
  </div>
</template>

<script>
import articleData from '@/mock/article.json'

export default {
  name: 'ArticleList',
  keepScroll: true,
  data () {
    return {
      currentPage: 1, 
      pageSize: 15, 
      loading: false,
      list: [],
      refreshKey: 0
    }
  },
  computed: {
    tableData () {
      const start = this.pageSize * (this.currentPage - 1)
      return this.list.slice(start, start + this.pageSize)
    }
  },
  methods: {
   getData () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.list = articleData
      }, 1000)
    },
    gotoDetail (row) {
      this.$router.push({
        path: `/article/${row.id}`
      })
    }
  },
  created () {
    this.getData()
  },
  activated () {
    this.refreshKey++
    this.$nextTick(() => {
      this.restoreKeepScrollPos?.()
    })
  }
}
</script>

<style lang='less' scoped>
</style>