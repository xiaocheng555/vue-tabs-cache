import Vue from 'vue'
import Router from 'vue-router'

const routes = [
  {
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
      }
    ]
  }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router