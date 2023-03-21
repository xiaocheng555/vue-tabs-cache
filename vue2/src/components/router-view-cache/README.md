# router-view-cache

将 `<keep-alive>` 和 `<router-view>` 封装在一起，提供路由缓存配置、清除缓存、支持恢复滚动位置等功能。

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
  scroller: '#box' // 单独设置路由组件滚动容器；也可设置多个，如 ['#box1', '#box2']
}
```

## routeCache 对象

### 使用

``` js
import { routeCache } from '@/components/router-view-cache'

console.log(routeCache.caches) // 查看缓存的组件
routeCache.removeCache('Home') // 清除组件名为Home的缓存
routeCache.removeRouteCache('home') // 清除路由名为home的缓存
```

### routeCache prop

| 参数              | 类型       |    说明   |
|----------------- |---------- |---------- |
| routeCache.caches           | Array     | 缓存的路由组件名称，最终会传入 `<keep-alive :include="caches">`    |
| routeCache.removeCache(componentName)   | Function(string)  | 移除路由缓存；传入组件名称  |
| routeCache.removeRouteCache(routeName)  | Function(string)  | 移除路由缓存；传入路由名称  |


## 注意

* 缓存组件的名称不能重复，不然会导致一些奇怪问题



