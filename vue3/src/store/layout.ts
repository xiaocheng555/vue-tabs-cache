import { defineStore } from 'pinia'

const useLayoutStore = defineStore('layout', {
  state: () => {
    return {
      isRenderTab: true
    }
  },
  actions: {
    setIsRenderTab (data: boolean) {
      this.isRenderTab = data
    }
  }
})

export default useLayoutStore
