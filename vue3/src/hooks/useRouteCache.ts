import { ref, nextTick } from 'vue'

const caches = ref<string[]>([])

export default function useRouteCache() {
  // 添加缓存的路由组件
  function addCache(componentName: string | string[]) {
    if (Array.isArray(componentName)) {
      componentName.forEach(addCache)
      return
    }

    if (!componentName || caches.value.includes(componentName)) return

    caches.value.push(componentName)
    console.log('缓存路由组件：', componentName)
  }

  // 移除缓存的路由组件
  function removeCache(componentName: string) {
    const index = caches.value.indexOf(componentName)
    if (index > -1) {
      console.log('清除缓存的路由组件：', componentName)
      return caches.value.splice(index, 1)
    }
  }

  // 移除缓存的路由组件的实例
  async function removeCacheEntry(componentName: string) {
    if (removeCache(componentName)) {
      await nextTick()
      addCache(componentName)
    }
  }

  // 清除缓存的路由组件的实例
  function clearEntry() {
    caches.value.slice().forEach(key => {
      removeCacheEntry(key)
    })
  }

  return {
    caches,
    addCache,
    removeCache,
    removeCacheEntry,
    clearEntry
  }
}