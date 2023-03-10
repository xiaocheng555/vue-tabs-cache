<template>
  <div>
    <el-container v-loading="loading">
      <el-aside width="300px">
        <el-table :data="cateList" border>
          <el-table-column label="运动方式">
            <template v-slot="{ row }">
              <a 
                href="javascript:;" 
                @click="curCate = row.name" 
                :class="curCate === row.name ? 'active' : ''"
                style="display: block;">{{row.name}}</a>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-main style="padding: 0 20px;">
        <el-table :data="userList" border>
          <el-table-column prop="id" label="id" />
          <el-table-column prop="userName" label="用户名" />
          <el-table-column prop="sport" label="运动方式" />
          <el-table-column prop="day" label="练习时长（天）" />
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-link type="danger" @click="delUserData(row)">删除并刷新tab1</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import  userData from '@/mock/user.json'
import useRouteCache from '@/hooks/useRouteCache'

defineOptions({
  name: 'Soon2'
})

interface User {
  id?: number, 
  userName?: string,
  sport?: string,
  day?: number,
  children?: []
}

const loading = ref(false)
const curCate = ref('')
const cateList = ref<{name?: string}[]>([])
const userList = ref<User[]>([])
const { removeCache } = useRouteCache()

function getData () {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    cateList.value = Array.from(new Set(userData.map(user => user.sport))).map(item => ({ name: item }))
    getUserList()
  }, 1000)
}

function getUserList () {
  userList.value = userData.filter(user => user.sport === curCate.value)
}

function delUserData (user: User) {
  const index = userData.findIndex(u => u.id === user.id)
  userData.splice(index, 1)
  getData()
  removeCache('Soon1') // 清除另一个tab缓存
}

watch(() => curCate.value, getUserList)

onBeforeMount(() => {
  getData()
})
</script>

<style lang='less' scoped>
.active {
  color: red;
}
</style>