import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Empty from './views/Empty.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'layout',
    path: '/',
    component: () => import('@/layout/Index.vue'),
    children: [
      {
        path: '',
        component: () => import('./views/Home.vue'),
        name: 'home',
        meta: {
          // keepAlive: true,
          title: '首页'
        }
      },
      {
        path: '/article',
        component: () => import('./views/ArticleList.vue'),
        name: 'article-list',
        meta: {
          keepAlive: true,
          title: '文章列表'
        }
      },
      {
        path: '/article/:id',
        component: () => import('./views/Article.vue'),
        name: 'article-detail',
        props: true,
        meta: {
          keepAlive: true,
          title: '文章详情'
        }
      },
      {
        path: '/KeepScroll',
        component: () => import('./views/KeepScroll.vue'),
        name: 'KeepScroll',
        meta: {
          keepAlive: true,
          title: '记录滚动位置'
        }
      },
      {
        // 空白页，刷新tab页时用来做中转
        path: '/_empty',
        name: '_empty',
        component: Empty
      }
    ]
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})