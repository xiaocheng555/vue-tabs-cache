<template>
  <div>
    <el-button  type="primary" @click="visible = !visible">打开抽屉</el-button>
    <el-button  type="primary" @click="visible2 = !visible2">打开弹窗</el-button>
    <el-button  type="primary" @click="visible3 = !visible3">打开Ant抽屉</el-button>
    <el-button  type="primary" @click="visible4 = !visible4">打开Ant弹窗</el-button>
    <HistoryDrawer v-model="visible" title="抽屉" :history="{ drawer: true }">
      El抽屉
    </HistoryDrawer>
    <HistoryDialog v-model="visible2" title="弹窗" :history="{ dialog: true }">
      El弹窗
    </HistoryDialog>
    <HistoryAntDrawer v-model="visible3" title="抽屉" :history="{ antDrawer: true }">
      Ant抽屉
    </HistoryAntDrawer>
    <HistoryAntModal v-model="visible4" title="弹窗" :history="{ antModal: true }">
      Ant弹窗
    </HistoryAntModal>
    
    <el-divider></el-divider>
    
    <el-button type="primary" @click="visible5 = !visible5">多层抽屉</el-button> &nbsp; &nbsp;
    <el-link>
      <a href="#/?nestDrawer1=true&nestDrawer2=true&nestDialog1=true" target="_blank">打开链接（/?nestDrawer1=true&nestDrawer2=true&nestDialog1=true）</a>
    </el-link>
    
    <HistoryDrawer append-to-body v-model="visible5" title="内容页" :history="{ nestDrawer1: true }">
      巴山楚水凄凉地，二十三年弃置身。<br><br>
      怀旧空吟闻笛赋，到乡翻似烂柯人。<br><br>
      沉舟侧畔千帆过，病树前头万木春。<br><br>
      今日听君歌一曲，暂凭杯酒长精神。<br><br>
      
      <el-button @click="visible6 = !visible6">个人信息</el-button>&nbsp;&nbsp;
      <router-link to="/A"><el-button type="success">跳转页面</el-button></router-link>
      
      <HistoryDrawer append-to-body v-model="visible6" title="个人信息" :history="{ nestDrawer2: true }">
        性别：男<br><br>
        爱好：女<br><br>

        <el-button @click="visible7 = !visible7">兴趣爱好</el-button>&nbsp;&nbsp;
        <router-link to="/A"><el-button type="success">跳转页面</el-button></router-link>
        <HistoryDialog append-to-body v-model="visible7" title="兴趣爱好" :history="{ nestDialog1: true }">
          唱、跳、rap、篮球<br><br>
          <router-link to="/A"><el-button type="success">跳转页面</el-button></router-link>
        </HistoryDialog>
      </HistoryDrawer>
    </HistoryDrawer>
    
    
    <el-divider></el-divider>
    <Demo></Demo>
    
    <el-divider></el-divider>
    <router-link to="/Back">返回上一页测试</router-link>
  </div>
</template>

<script>
import HistoryDrawer from '../components/HistoryDrawer.vue'
import HistoryDialog from '../components/HistoryDialog.vue'
import HistoryAntDrawer from '../components/HistoryAntDrawer.vue'
import HistoryAntModal from '../components/HistoryAntModal.vue'
import Demo from './Demo.vue'

export default {
  name: 'home',
  components: {
    HistoryDrawer,
    HistoryDialog,
    HistoryAntDrawer,
    HistoryAntModal,
    Demo
  },
  data ()  {
    return {
      visible: false,
      visible2: false,
      visible3: false,
      visible4: false,
      visible5: false,
      visible6: false,
      visible7: false,
      visible8: false,
    }
  }
}

</script>

<style lang='less' scoped>
</style>