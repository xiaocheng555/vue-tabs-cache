# router-view-cache

## 使用

``` vue
<router-view-cache scroller="html"></router-view-cache>

<script setup>
import RouterViewCache from '@/components/router-view-cache'
</script>
```

## props

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| scroller    | 设置滚动容器，能保持缓存路由的滚动位置 | String/Array | — | - |
| max         | 最大缓存数，同 `<keep-avlie>` 的max | - | — | - |

## 路由meta配置

``` js
meta: {
  keepAlive: true, // 设置路由缓存
  scroller: '#box' // 单独设置路由组件滚动容器；可设置多个，如 ['#box1', '#box2']
}
```

## useRouteCache （hook）

### 使用

``` js
import { useRouteCache } from '@/components/router-view-cache'

const { 
  caches,
  removeCache,
  removeRouteCache
} = useRouteCache()

console.log(caches)
removeCache('Home') // 清除组件名为Home的缓存
removeRouteCache('home') // 清除路由名为home的缓存
```

### api

| 参数              | 类型       |    说明   |
|----------------- |---------- |---------- |
| caches           | Array     | 缓存的路由组件名称，最终会传入 `<keep-alive :include="caches">`    |
| removeCache(componentName)   | Function(string)  | 移除路由缓存；传入组件名称  |
| removeRouteCache(routeName)  | Function(string)  | 移除路由缓存；传入路由名称  |


## 注意

* 缓存组件的名称不能重复，不然会导致一些奇怪问题



