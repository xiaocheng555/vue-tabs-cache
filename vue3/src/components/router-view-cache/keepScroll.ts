import type { App } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const SCROLLBOX = 'router-view-cache-scroller'
const KEEPSCROLL = 'keepScroll'

function toArray (data: string[] | string) {
  return Array.isArray(data) ? data : [data]
}

function install (app: App) {
  
  app.mixin({
    created () {
      if (this.$attrs[SCROLLBOX]) {
        if (this.$attrs[KEEPSCROLL] === false) return
        
        onBeforeRouteLeave(() => {
          const scrollBoxs = toArray(this.$attrs[SCROLLBOX])
          this.$_pos = {} // 记录滚动位置
          scrollBoxs.forEach(box => {
            const scroller = document.querySelector(box)
            if (scroller) {
              this.$_pos[box] = {
                top: scroller.scrollTop,
                left: scroller.scrollLeft
              }
            }
          })
        });
      }
    },
    activated () {
      if (this.$attrs[SCROLLBOX]) {
        if (this.$attrs[KEEPSCROLL] === false) return
        
        const scrollBoxs = toArray(this.$attrs[SCROLLBOX])
        scrollBoxs.forEach(box => {
          const scroller = document.querySelector(box)
          const pos = this.$_pos?.[box] // 获取滚动位置
          if (scroller && pos) {
            scroller.scrollTop = pos.top 
            scroller.scrollLeft = pos.left
          }
        })
      }
    }
  })
}

export default function registerKeepScroll (app: App) {
  app.use(install)
}
