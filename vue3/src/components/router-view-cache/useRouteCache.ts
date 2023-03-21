import { ref, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

const caches = ref<string[]>([])
const routeComponeotMap = new Map<string, string>() // 根据路由名找到组件名的映射
const cmpNames: { [prop: string]: string } = {}
let collect = false // 是否进行了收集缓存

export default function useRouteCache () {
  const route = useRoute()

  // 收集缓存（通过监听）
  function collectCaches () {
    if (collect) return // 只调用一次

    collect = true
    watch(() => route.path, collectRouteCaches, {
      immediate: true
    })
  }

  // 收集当前路由相关的缓存
  async function collectRouteCaches () {
    await nextTick()
    route.matched.forEach(routeMatch => {
      const componentDef: any = routeMatch.components?.default
      const componentName = componentDef?.name || componentDef?.__name
      const file: string = componentDef.__file

      checkComponentName(componentName, file)

      // 配置了meta.keepAlive的路由组件添加到缓存
      if (routeMatch.meta.keepAlive) {
        if (!componentName) {
          console.warn(`${routeMatch.path} 路由的组件名称name为空，无法添加缓存`)
          return
        }
        if (routeMatch.name) {
          routeComponeotMap.set(routeMatch.name as string, componentName)
        }
        addCache(componentName)
      } else if (routeMatch.meta.keepAlive === false) {
        removeCache(componentName)
      }
    })
  }

  // 检测路由组件名称是否重复（组件重名会缓存到不该缓存的组件，而且不容易排查问题，所以开发环境时检测重名）
  function  checkComponentName (name: string, file: string) {
    if (cmpNames[name]) {
      if (cmpNames[name] !== file) {
        console.warn(`${file} 与${cmpNames[name]} 组件名称重复： ${name}，可能导致组件缓存问题`)
      }
    } else {
      cmpNames[name] = file
    }
  }

  // 添加缓存的路由组件
  function addCache (componentName: string) {
    if (!componentName || caches.value.includes(componentName)) return
    caches.value.push(componentName)
    console.log('缓存路由组件：', componentName)
  }

  // 移除缓存的路由组件
  function removeCache (componentName: string) {
    const index = caches.value.indexOf(componentName)
    if (index > -1) {
      console.log('清除缓存的路由组件：', componentName)
      return caches.value.splice(index, 1)
    }
  }

  // 移除缓存的路由组件（传入路由名称）
  function removeRouteCache (routeName: string) {
    const componentName = cmpNames[routeName]
    if (componentName) {
      removeCache(componentName)
    }
  }

  // 移除缓存的路由组件的实例（极少会用到）
  async function removeCacheEntry (componentName: string) {
    if (removeCache(componentName)) {
      await nextTick()
      addCache(componentName)
    }
  }

  return {
    caches,
    collectCaches,
    addCache,
    removeCache,
    removeRouteCache,
    removeCacheEntry
  }
}
