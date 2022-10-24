import { ref, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

const caches = ref<string[]>([])
let collect = false
let cmpNames: { [index: string]: string } = {}

export default function useRouteCache () {
  const route = useRoute()
  
  // 收集当前路由相关的缓存
  function collectRouteCaches () {
    route.matched.forEach(routeMatch => {
      const componentDef: any = routeMatch.components?.default
      const componentName = componentDef?.name || componentDef?.__name
      const file: string = componentDef.__file
      
      checkRouteComponentName(componentName, file)
      
      // 配置了meta.keepAlive的路由组件添加到缓存
      if (routeMatch.meta.keepAlive) {
        if (!componentName) {
          console.warn(`${routeMatch.path} 路由的组件名称name为空`)
          return
        }
        addCache(componentName)
      } else {
        removeCache(componentName)
      }
    })
  }
  
  // 检测路由组件名称是否重复（组件重名会缓存到不该缓存的组件，而且不容易排查问题，所以开发环境时检测重名）
  function  checkRouteComponentName (name: string, file: string) {
    if (cmpNames[name]) {
      if (cmpNames[name] !== file) {
        console.warn(`${file} 与${cmpNames[name]} 组件名称重复： ${name}`)
      }
    } else {
      cmpNames[name] = file
    }
  }
  
  // 收集缓存（通过监听）
  function collectCaches () {
    if (collect) {
      console.warn('useRouteCache：不需要重复收集缓存')
      return
    }
    collect = true
    watch(() => route.path, collectRouteCaches, {
      immediate: true
    })
  }
  
  // 添加缓存的路由组件
  function addCache (componentName: string | string[]) {
    if (Array.isArray(componentName)) {
      componentName.forEach(addCache)
      return
    }

    if (!componentName || caches.value.includes(componentName)) return
    caches.value.push(componentName)
    console.log('缓存路由组件：', componentName)
  }

  // 移除缓存的路由组件
  function removeCache (componentName: string | string[]) {
    if (Array.isArray(componentName)) {
      componentName.forEach(removeCache)
      return
    }
    
    const index = caches.value.indexOf(componentName)
    if (index > -1) {
      console.log('清除缓存的路由组件：', componentName)
      return caches.value.splice(index, 1)
    }
  }

  // 移除缓存的路由组件的实例
  async function removeCacheEntry (componentName: string) {
    if (removeCache(componentName)) {
      await nextTick()
      addCache(componentName)
    }
  }

  // 清除缓存的路由组件的实例
  function clearEntry () {
    caches.value.slice().forEach(key => {
      removeCacheEntry(key)
    })
  }

  return {
    collectCaches,
    caches,
    addCache,
    removeCache,
    removeCacheEntry,
    clearEntry
  }
}