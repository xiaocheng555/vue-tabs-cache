import { defineStore } from 'pinia'
import { RouteLocationRaw } from 'vue-router'

export type CloseTabFn = ((options: {
  name?: string,
  rediect?: RouteLocationRaw,
  isReplace?: boolean
}) => void)

const useLayoutTab = defineStore('layoutTab', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      closeTab: (() => {
        console.warn('closeTab函数未初始化')
      }) as CloseTabFn
    }
  },
  actions: {
    registerCloseTab (data: CloseTabFn) {
      this.closeTab = data
    }
  }
})

export default useLayoutTab
