import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

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
          keepAlive: true,
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
      }
    ]
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})