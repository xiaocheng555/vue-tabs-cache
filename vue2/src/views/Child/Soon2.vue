<template>
  <div>
    <el-container v-loading="loading">
      <el-aside width="300px">
        <el-table :data="cateList" border>
          <el-table-column label="运动方式">
            <template v-slot="{ row }">
              <a 
                href="javascript:;" 
                :class="curCate === row.name ? 'active' : ''"
                @click="curCate = row.name" 
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
              <el-link type="danger" @click="delUserData(row)">删除并刷新tab2</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import userData from '@/mock/user.json'
import { routeCache } from '@/components/router-view-cache'

export default {
  name: 'Soon2',
  data () {
    return {
      loading: false,
      curCate: '',  
      cateList: [],
      userList: []
    }
  },
  methods: {
    getData () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.cateList = Array.from(new Set(userData.map(user => user.sport))).map(item => ({ name: item }))
        this.getUserList()
      }, 1000)
    },
    getUserList () {
      this.userList = userData.filter(user => user.sport === this.curCate)
    },
    delUserData (user) {
      const index = userData.findIndex(u => u.id === user.id)
      userData.splice(index, 1)
      this.getData()
      routeCache.removeCache('Soon1') // 清除另一个tab缓存
    }
  },
  watch: {
    curCate () {
      this.getUserList()
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang='less' scoped>
.active {
  color: red;
}
</style>