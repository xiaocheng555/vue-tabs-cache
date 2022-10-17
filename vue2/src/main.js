import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import { Drawer, Modal } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.component(Drawer.name, Drawer)
Vue.component(Modal.name, Modal)
Vue.use(ElementUI)

// history.state 里记录是否有返回页面
let once = true
function recordHasBack (router) {
  router.afterEach(() => {
    console.log('recordHasBack')
    if (typeof window.history.state?.hasBack !== 'boolean') {
      history.replaceState({
        ...history.state,
        hasBack: once ? false : true
      }, '')
    }
    once = false
  })
}
recordHasBack(router)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')