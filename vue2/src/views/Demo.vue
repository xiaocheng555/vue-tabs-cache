<template>
  <div>
    <h2>Demo</h2>
    <div>
      <el-table
        v-loading="loading"
        :data="list"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="id">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="desc"
          label="详情">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-link type="primary" @click="onEdit(row)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <HistoryDrawer 
      v-model="visible" 
      :title="curItem.name" 
      :history="{ id: curItem.id }"
      :auto="false"
      @auto-open="initDrawer">
      id：{{curItem.id}} <br><br>
      姓名：{{curItem.name}} <br><br>
      详情：{{curItem.desc}} <br><br>
      
      <br><br>
      <el-button type="primary" @click="refresh">刷新页面</el-button>&nbsp;&nbsp;
      <router-link to="/A"><el-button type="success">跳转页面</el-button></router-link>
    </HistoryDrawer>
  </div>
</template>

<script>
import HistoryDrawer from '../components/HistoryDrawer.vue'

export default {
  name: 'demo',
  components: {
    HistoryDrawer
  },
  data () {
    return {
      list: [],
      curItem: {},
      visible: false,
      loading: false
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    fetchList () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.list = [
          {
            id: 1,
            name: '张三',
            desc: '打球很厉害'
          },
          {
            id: 2,
            name: '李四',
            desc: '唱歌很厉害'
          }
        ]
        this.initDrawer()
      }, 1000)
    },
    initDrawer () {
      // 手动打开弹窗
      if (this.id) {
        this.curItem = this.list.find(item => String(item.id) === String(this.id))
        this.visible = true
      }
    },
    onEdit (row) {
      this.curItem = row
      this.visible = true
    },
    refresh () {
      window.location.reload()
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style lang='less' scoped>
</style> 