import Vue from 'vue'
import Router from 'vue-router'
import { extendRouterHistoryState } from './router-extend'

const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue'),
    name: 'Home',
  },
  {
    path: '/A',
    component: () => import('./views/A.vue'),
    name: 'A',
  },
  {
    path: '/Back',
    component: () => import('./views/Back.vue'),
    name: 'Back',
  },
  {
    path: '/Back2',
    component: () => import('./views/Back2.vue'),
    name: 'Back2',
  }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})
extendRouterHistoryState(router)

export default router