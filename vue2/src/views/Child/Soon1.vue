<template>
  <div>
    <el-container v-loading="loading">
      <el-aside width="300px">
        <el-table :data="cateList" border>
          <el-table-column label="用户名">
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
          <el-table-column prop="sport" label="喜欢的运动" />
          <el-table-column prop="day" label="练习时长（天）" />
          <el-table-column prop="userName" label="用户名" />
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
import { mapActions } from 'vuex'

export default {
  name: 'Soon1',
  data () {
    return {
      loading: false,
      curCate: '',  
      cateList: [],
      userList: []
    }
  },
  methods: {
    ...mapActions('cache', [
      'removeCache',
    ]),
    getData () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.cateList = Array.from(new Set(userData.map(user => user.userName))).map(item => ({ name: item }))
        this.getUserList()
      }, 1000)
    },
    getUserList () {
      this.userList = userData.filter(user => user.userName === this.curCate)
    },
    delUserData (user) {
      const index = userData.findIndex(u => u.id === user.id)
      userData.splice(index, 1)
      this.getData()
      this.removeCache('Soon2') // 清除另一个tab缓存
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