import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store/index.js'
import keepScrollMixin from './mixins/keepScroll'

Vue.use(ElementUI)
Vue.use(keepScrollMixin, {
  scroller: '#app-main-scroller'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')