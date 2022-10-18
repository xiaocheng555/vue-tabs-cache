import { onActivated } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

let gobalScrollBox = 'html' // 全局滚动盒子

export function configKeepScroll (scrollBox: string) {
  gobalScrollBox = scrollBox
}

export default function useKeepScroll (scrollBox?: string) {
  let pos = [0, 0]
  let scroller: HTMLElement | null
  
  onActivated(() => {
    scroller = document.querySelector(scrollBox || gobalScrollBox)
    if (!scroller) {
      console.warn(`useKeepScroll: 未找到 ${scrollBox || gobalScrollBox} Dom滚动容器`)
      return
    }
    scroller.scrollTop = pos[0]
    scroller.scrollLeft = pos[1]
  })
  
  onBeforeRouteLeave(() => {
    if (scroller) {
      pos = [scroller.scrollTop, scroller.scrollLeft]
    }
  })
}