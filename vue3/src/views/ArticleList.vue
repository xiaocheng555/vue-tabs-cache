<template>
  <div>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column prop="id" label="id" />
      <el-table-column prop="userName" label="用户名">
        <template v-slot="{ row }">
          <el-link type="primary" @click="gotoDetail(row)">{{row.userName}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="content" label="内容">
        <template v-slot="{ row }">
          {{row.content.slice(0, 30)}}...
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时间" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-link type="primary" @click="gotoDetail(row)">进入详情</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="list.length"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import articleData from '@/mock/article.json'
import { IArticle } from './data.d'
import useKeepScroll from '@/hooks/useKeepScroll'

const router = useRouter()
const list = ref<IArticle []>([])
const currentPage = ref(1)
const pageSize = ref(15)
const loading = ref(false)
const tableData = computed(() => {
  const start = pageSize.value * (currentPage.value - 1)
  return list.value.slice(start, start + pageSize.value)
})
useKeepScroll()

function getData () {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    list.value = articleData
  }, 1000)
}

function gotoDetail (row: IArticle) {
  router.push({
    path: `/article/${row.id}`
  })
}

onMounted(() => {
  getData()
})

</script>

<style lang='less' scoped>
</style>