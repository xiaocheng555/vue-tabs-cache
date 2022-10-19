import { defineStore } from 'pinia'

export type CloseTabFn = ((routeName?: string) => void)

const useLayoutStore = defineStore('layout', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      closeTab: (() => {
        console.warn('closeTab函数未初始化')
      }) as CloseTabFn,
      isRenderTab: true
    }
  },
  actions: {
    registerCloseTab (data: CloseTabFn) {
      this.closeTab = data
    },
    setIsRenderTab (data: boolean) {
      this.isRenderTab = data
    }
  }
})

export default useLayoutStore
