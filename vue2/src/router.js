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
      },
      {
        // 多级缓存
        path: '/child',
        name: 'child',
        component: () => import('./views/Child/Index.vue'),
        meta: {
          title: '多级缓存',
          keepAlive: true,
        },
        redirect: {
          path: '/soon1'
        },
        children: [
          {
            path: '/soon1',
            name: 'soon1',
            component: () => import('./views/Child/Soon1.vue'),
            meta: {
              keepAlive: true
            }
          },
          {
            path: '/soon2',
            name: 'soon2',
            component: () => import('./views/Child/Soon2.vue'),
            meta: {
              keepAlive: true
            }
          }
        ]
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