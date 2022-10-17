import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { configKeepScroll } from '@/hooks/useKeepScroll'

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.use(Router)
app.mount('#app')
configKeepScroll('#app-main-scroller')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

